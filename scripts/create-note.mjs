import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function requireValue(value, label) {
  const normalized = String(value || '').trim();

  if (!normalized) {
    throw new Error(`${label} is required.`);
  }

  return normalized;
}

function decodeBody() {
  const encodedBody = String(process.env.NOTE_BODY_BASE64 || '').trim();

  if (encodedBody) {
    return Buffer.from(encodedBody, 'base64').toString('utf8').trim();
  }

  return String(process.env.NOTE_BODY || '')
    .replace(/\\n/g, '\n')
    .trim();
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function localIsoWithOffset(date) {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absoluteOffset = Math.abs(offsetMinutes);

  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    'T',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
    ':',
    pad(date.getSeconds()),
    sign,
    pad(Math.floor(absoluteOffset / 60)),
    ':',
    pad(absoluteOffset % 60)
  ].join('');
}

function normalizeDate(value) {
  const input = String(value || '').trim();

  if (!input) {
    return localIsoWithOffset(new Date());
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return localIsoWithOffset(new Date(`${input}T12:00:00`));
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input)) {
    return localIsoWithOffset(new Date(input));
  }

  return input;
}

function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function yamlString(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function dateParts(dateValue) {
  const match = String(dateValue).match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) {
    throw new Error(`Date must start with YYYY-MM-DD. Received: ${dateValue}`);
  }

  return {
    year: match[1],
    month: match[2],
    day: match[3]
  };
}

function uniquePath(directory, basename) {
  let candidate = path.join(directory, `${basename}.md`);
  let suffix = 2;

  while (fs.existsSync(candidate)) {
    candidate = path.join(directory, `${basename}-${suffix}.md`);
    suffix += 1;
  }

  return candidate;
}

function setGitHubOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) return;

  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value.replace(/\r?\n/g, ' ')}\n`);
}

const title = requireValue(process.env.NOTE_TITLE, 'NOTE_TITLE');
const body = requireValue(decodeBody(), 'NOTE_BODY or NOTE_BODY_BASE64');
const date = normalizeDate(process.env.NOTE_DATE);
const description = String(process.env.NOTE_DESCRIPTION || '').trim();
const explicitSlug = String(process.env.NOTE_SLUG || '').trim();
const slug = slugify(explicitSlug || title);
const dryRun = String(process.env.NOTE_DRY_RUN || '').toLowerCase() === 'true';

if (!slug) {
  throw new Error('Could not generate a usable slug for this note.');
}

const { year, month, day } = dateParts(date);
const outputDirectory = path.join(root, 'src', 'notes', year);
const outputPath = uniquePath(outputDirectory, `${year}-${month}-${day}-${slug}`);
const relativeOutputPath = path.relative(root, outputPath).replace(/\\/g, '/');

const frontMatter = [
  '---',
  `date: ${date}`,
  `title: ${yamlString(title)}`,
  description ? `description: ${yamlString(description)}` : null,
  'tags: [notes]',
  '---'
].filter(Boolean);

const note = `${frontMatter.join('\n')}\n\n${body}\n`;

if (!dryRun) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(outputPath, note, 'utf8');
}

setGitHubOutput('note_path', relativeOutputPath);
console.log(`${dryRun ? 'Would create' : 'Created'} ${relativeOutputPath}`);
