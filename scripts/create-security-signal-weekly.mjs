import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const defaultImage = '/assets/images/security-signal-weekly.png';
const defaultImageAlt =
  'Security Signal Weekly editorial graphic with the series title, signal bars, and cybersecurity alert panels in the CybersecKyle site colors.';
const defaultTags = [
  'cybersecurity',
  'infosec',
  'security-signal-weekly',
  'vulnerability-management',
  'incident-response',
  'threat-intel',
  'news'
];
const defaultMastodonTags = ['Cybersecurity', 'InfoSec', 'ThreatIntel', 'WeeklySecurity'];

function parseArgs(argv) {
  const args = {
    dryRun: false,
    input: '',
    output: '',
    date: ''
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--dry-run' || arg === '--preview') {
      args.dryRun = true;
    } else if (arg === '--input') {
      args.input = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--output') {
      args.output = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--date') {
      args.date = argv[index + 1] || '';
      index += 1;
    } else if (!args.input && !arg.startsWith('--')) {
      args.input = arg;
    }
  }

  return args;
}

function requireValue(value, label) {
  const normalized = String(value || '').trim();

  if (!normalized) {
    throw new Error(`${label} is required.`);
  }

  return normalized;
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
    return localIsoWithOffset(new Date(`${input}T13:00:00`));
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input)) {
    return localIsoWithOffset(new Date(input));
  }

  return input;
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

function formatDateRange(dateRange, dateValue) {
  const explicit = String(dateRange || '').trim();

  if (explicit) {
    return explicit;
  }

  const end = new Date(`${dateValue.slice(0, 10)}T12:00:00`);
  const start = new Date(end);
  start.setDate(end.getDate() - 6);

  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
  const sameMonth = start.getMonth() === end.getMonth();
  const startMonth = monthFormatter.format(start);
  const endMonth = monthFormatter.format(end);

  if (sameMonth) {
    return `${startMonth} ${start.getDate()}-${end.getDate()}, ${end.getFullYear()}`;
  }

  return `${startMonth} ${start.getDate()}-${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
}

function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function yamlString(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function yamlArray(values) {
  return `[${values.map(value => String(value).trim()).filter(Boolean).join(', ')}]`;
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

function readInput(file) {
  const inputPath = path.resolve(root, requireValue(file, '--input'));
  const raw = fs.readFileSync(inputPath, 'utf8');

  return JSON.parse(raw);
}

function normalizeStory(story, index) {
  const title = requireValue(story.title, `stories[${index}].title`);
  const whatHappened = requireValue(story.whatHappened, `stories[${index}].whatHappened`);
  const whyItMatters = requireValue(story.whyItMatters, `stories[${index}].whyItMatters`);
  const actions = Array.isArray(story.actions) ? story.actions.map(action => String(action).trim()).filter(Boolean) : [];

  if (actions.length < 2) {
    throw new Error(`stories[${index}].actions must include at least two useful actions.`);
  }

  return {
    title,
    whatHappened,
    whyItMatters,
    actions
  };
}

function renderActions(actions) {
  return actions.map(action => `- ${action}`).join('\n');
}

function renderPost(data, date, dateRange) {
  const title = String(data.title || `Security Signal Weekly: ${dateRange}`).trim();
  const description = String(
    data.description ||
      "The week's biggest cybersecurity stories, filtered for defender impact, patch urgency, active exploitation, and what IT teams should actually do next."
  ).trim();
  const overview = requireValue(data.overview, 'overview');
  const realityCheck = requireValue(data.realityCheck, 'realityCheck');
  const stories = Array.isArray(data.stories) ? data.stories.map(normalizeStory) : [];
  const tags = Array.isArray(data.tags) && data.tags.length ? data.tags : defaultTags;
  const mastodonTags =
    Array.isArray(data.mastodonTags) && data.mastodonTags.length ? data.mastodonTags : defaultMastodonTags;

  if (stories.length !== 10) {
    throw new Error(`Security Signal Weekly must include exactly 10 stories. Received ${stories.length}.`);
  }

  const frontMatter = [
    '---',
    `date: ${date}`,
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `featuredImage: ${data.featuredImage || defaultImage}`,
    `featuredImageAlt: ${yamlString(data.featuredImageAlt || defaultImageAlt)}`,
    `tags: ${yamlArray(tags)}`,
    'mastodon_post: true',
    'mastodon_url:',
    `mastodon_tags: ${yamlArray(mastodonTags)}`,
    '---'
  ];

  const storySections = stories
    .map((story, index) =>
      [
        `### ${index + 1}. ${story.title}`,
        '',
        `**What happened:** ${story.whatHappened}`,
        '',
        `**Why it matters:** ${story.whyItMatters}`,
        '',
        '**Action:**',
        '',
        renderActions(story.actions)
      ].join('\n')
    )
    .join('\n\n');

  return [
    frontMatter.join('\n'),
    '',
    '## Overview',
    '',
    overview,
    '',
    `> **Reality check:** ${realityCheck}`,
    '',
    '## Top 10 Security Signals',
    '',
    storySections,
    '',
    '## Closing Notes',
    '',
    requireValue(data.closingNotes, 'closingNotes'),
    ''
  ].join('\n');
}

function setGitHubOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) return;

  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${String(value).replace(/\r?\n/g, ' ')}\n`);
}

const args = parseArgs(process.argv.slice(2));
const data = readInput(args.input);
const date = normalizeDate(args.date || data.date);
const dateRange = formatDateRange(data.dateRange, date);
const title = String(data.title || `Security Signal Weekly: ${dateRange}`).trim();
const {year, month, day} = dateParts(date);
const outputDirectory = path.join(root, 'src', 'posts', year);
const basename = `${year}-${month}-${day}-${slugify(title)}`;
const outputPath = args.output ? path.resolve(root, args.output) : uniquePath(outputDirectory, basename);
const relativeOutputPath = path.relative(root, outputPath).replace(/\\/g, '/');
const post = renderPost(data, date, dateRange);

if (!args.dryRun) {
  fs.mkdirSync(path.dirname(outputPath), {recursive: true});
  fs.writeFileSync(outputPath, post, 'utf8');
}

setGitHubOutput('post_path', relativeOutputPath);
console.log(`${args.dryRun ? 'Would create' : 'Created'} ${relativeOutputPath}`);
