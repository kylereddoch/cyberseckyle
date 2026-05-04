import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import slugify from 'slugify';

import { author as siteAuthor, url as configuredSiteUrl } from '../src/_data/meta.js';

const root = process.cwd();
const defaultSearchRoots = [
  path.join(root, 'src', 'posts'),
  path.join(root, 'src', 'notes')
];
const dryRun =
  process.argv.includes('--dry-run') ||
  String(process.env.MASTODON_DRY_RUN || '').toLowerCase() === 'true';
const siteUrl = stripTrailingSlash(
  process.env.MASTODON_SITE_URL || siteAuthor?.website || configuredSiteUrl
);
const instance = stripTrailingSlash(process.env.MASTODON_INSTANCE || '');
const token = String(process.env.MASTODON_ACCESS_TOKEN || '').trim();
const defaultVisibility = String(process.env.MASTODON_VISIBILITY || 'public').trim();
const defaultLanguage = String(process.env.MASTODON_LANGUAGE || 'en').trim();
const statusLimit = Number(process.env.MASTODON_STATUS_LIMIT || 500);
const defaultTags = parseTags(process.env.MASTODON_DEFAULT_TAGS);

function stripTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '');
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function slugifyTitle(value) {
  return slugify(String(value || ''), {
    replacement: '-',
    remove: /[#,&,+()$~%.'":*¿?¡!<>{}]/g,
    lower: true
  });
}

function parseTags(value) {
  if (Array.isArray(value)) {
    return value;
  }

  return String(value || '')
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
}

function formatTags(tags) {
  return parseTags(tags)
    .map(tag => String(tag).replace(/^#/, '').replace(/[^A-Za-z0-9_]/g, ''))
    .filter(Boolean)
    .map(tag => `#${tag}`)
    .join(' ');
}

function yamlQuote(value) {
  return JSON.stringify(String(value));
}

function truncateAtWord(value, maxLength) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();

  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, Math.max(0, maxLength - 1)).trimEnd();
  const lastSpace = truncated.lastIndexOf(' ');

  return `${(lastSpace > 40 ? truncated.slice(0, lastSpace) : truncated).trim()}…`;
}

function walkMarkdownFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function getCandidateFiles() {
  const explicitFiles = process.argv
    .slice(2)
    .filter(arg => !arg.startsWith('--'))
    .map(file => path.resolve(root, file));

  if (explicitFiles.length) {
    return explicitFiles;
  }

  return defaultSearchRoots.flatMap(walkMarkdownFiles);
}

function parseFrontMatter(raw, file) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/);

  if (!match) {
    return null;
  }

  return {
    header: match[1],
    body: raw.slice(match[0].length),
    lineEnding: raw.includes('\r\n') ? '\r\n' : '\n',
    data: yaml.load(match[1]) || {},
    file
  };
}

function getPostUrl(file, data) {
  const relativePath = normalizePath(path.relative(root, file));

  if (data.permalink) {
    return new URL(String(data.permalink).replace(/index\.html$/, ''), `${siteUrl}/`).toString();
  }

  if (relativePath.startsWith('src/posts/weeklynotes/')) {
    const slug = relativePath
      .replace(/^src\/posts\/weeklynotes\//, '')
      .replace(/\.md$/, '/');

    return `${siteUrl}/notes/${slug}`;
  }

  if (relativePath.startsWith('src/notes/')) {
    return `${siteUrl}/notes/${path.basename(file, '.md')}/`;
  }

  return `${siteUrl}/blog/${slugifyTitle(data.title)}/`;
}

function getStatusText(data, postUrl) {
  const title = String(data.title || '').trim();
  const description = String(data.description || '').trim();
  const tags = formatTags(data.mastodon_tags || defaultTags);
  const customStatus = String(data.mastodon_status || '').trim();

  if (customStatus) {
    return customStatus
      .replaceAll('{title}', title)
      .replaceAll('{description}', description)
      .replaceAll('{url}', postUrl);
  }

  const heading = title ? `New by me: ${title}` : 'New by me';

  return [heading, postUrl, tags].filter(Boolean).join('\n\n');
}

function setFrontMatterValue(raw, parsed, key, value) {
  const eol = parsed.lineEnding;
  const valueLine = `${key}: ${yamlQuote(value)}`;
  const headerPattern = new RegExp(`^${key}:.*$`, 'm');

  let header = parsed.header;

  if (headerPattern.test(header)) {
    header = header.replace(headerPattern, valueLine);
  } else {
    header = `${header}${eol}${valueLine}`;
  }

  return `---${eol}${header}${eol}---${eol}${parsed.body}`;
}

function setGitHubOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) return;

  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${String(value).replace(/\r?\n/g, ' ')}\n`);
}

async function postToMastodon(status, file) {
  if (!instance || !token) {
    throw new Error('MASTODON_INSTANCE and MASTODON_ACCESS_TOKEN are required to post.');
  }

  const response = await fetch(`${instance}/api/v1/statuses`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `cyberseckyle-${path.basename(file, '.md')}`
    },
    body: JSON.stringify({
      status,
      visibility: defaultVisibility,
      language: defaultLanguage
    })
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

async function publishFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = parseFrontMatter(raw, file);

  if (!parsed) {
    return null;
  }

  const data = parsed.data;
  const relativePath = normalizePath(path.relative(root, file));

  if (data.draft || data.mastodon_post !== true || String(data.mastodon_url || '').trim()) {
    return null;
  }

  if (!data.title) {
    throw new Error(`${relativePath} has mastodon_post: true but no title.`);
  }

  const postUrl = getPostUrl(file, data);
  const status = getStatusText(data, postUrl);

  if (status.length > statusLimit) {
    throw new Error(`${relativePath} generated a ${status.length}-character status. Limit is ${statusLimit}.`);
  }

  if (dryRun) {
    console.log(`[dry-run] Would post ${relativePath}`);
    console.log(status);
    return { file: relativePath, mastodonUrl: 'dry-run', postUrl };
  }

  const mastodonStatus = await postToMastodon(status, file);
  const mastodonUrl = mastodonStatus.url || mastodonStatus.uri;

  if (!mastodonUrl) {
    throw new Error(`Mastodon did not return a status URL for ${relativePath}.`);
  }

  fs.writeFileSync(file, setFrontMatterValue(raw, parsed, 'mastodon_url', mastodonUrl), 'utf8');

  console.log(`Posted ${relativePath} to Mastodon: ${mastodonUrl}`);

  return { file: relativePath, mastodonUrl, postUrl };
}

const results = [];

for (const file of getCandidateFiles()) {
  const result = await publishFile(file);

  if (result) {
    results.push(result);
  }
}

setGitHubOutput('posted_count', results.length);
setGitHubOutput('posted_files', results.map(result => result.file).join(' '));

if (!results.length) {
  console.log('No eligible posts found for Mastodon.');
}
