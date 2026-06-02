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
const waitForPublicUrl = String(process.env.MASTODON_WAIT_FOR_PUBLIC_URL || 'true').toLowerCase() !== 'false';
const waitTimeoutSeconds = Number(process.env.MASTODON_WAIT_TIMEOUT_SECONDS || 360);
const waitIntervalSeconds = Number(process.env.MASTODON_WAIT_INTERVAL_SECONDS || 10);
const postMaxAttempts = Math.max(1, Math.floor(parseNumber(process.env.MASTODON_POST_MAX_ATTEMPTS, 3)));
const postRetryDelaySeconds = Math.max(0, parseNumber(process.env.MASTODON_POST_RETRY_DELAY_SECONDS, 10));

function stripTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '');
}

function parseNumber(value, fallback) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
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

function normalizeSlug(value) {
  return String(value || '').trim().replace(/^\/+|\/+$/g, '');
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

  return `${siteUrl}/blog/${normalizeSlug(data.slug) || slugifyTitle(data.title)}/`;
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getMetaContent(html, property) {
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `<meta\\s+(?=[^>]*(?:property|name)=["']${escapedProperty}["'])(?=[^>]*content=["']([^"']+)["'])[^>]*>`,
    'i'
  );
  const match = html.match(pattern);

  return match?.[1] || '';
}

async function fetchOk(url) {
  const response = await fetch(url, { redirect: 'follow' });

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response;
}

async function waitForPublishedPost(postUrl, relativePath) {
  if (!waitForPublicUrl) {
    return;
  }

  const deadline = Date.now() + waitTimeoutSeconds * 1000;
  let attempt = 0;
  let lastError = '';

  while (Date.now() < deadline) {
    attempt += 1;

    try {
      const response = await fetchOk(postUrl);
      const html = await response.text();
      const ogImage = getMetaContent(html, 'og:image');

      if (!ogImage) {
        throw new Error(`${postUrl} is live, but no og:image meta tag was found yet`);
      }

      const ogImageUrl = new URL(ogImage, postUrl).toString();
      await fetchOk(ogImageUrl);

      console.log(`Confirmed ${relativePath} is live with OG image: ${ogImageUrl}`);
      return;
    } catch (error) {
      lastError = error.message;
      console.log(
        `Waiting for ${relativePath} to be live before posting to Mastodon ` +
          `(attempt ${attempt}): ${lastError}`
      );
      await sleep(waitIntervalSeconds * 1000);
    }
  }

  throw new Error(
    `Timed out after ${waitTimeoutSeconds}s waiting for ${relativePath} to be publicly available. ` +
      `Last check: ${lastError}`
  );
}

function summarizeResponseBody(value, maxLength = 500) {
  const body = String(value || '').replace(/\s+/g, ' ').trim();

  if (body.length <= maxLength) {
    return body;
  }

  return `${body.slice(0, maxLength)}...`;
}

function isRetryableMastodonStatus(status) {
  return status === 429 || status >= 500;
}

function getMastodonRetryDelayMs(response) {
  const retryAfter = response.headers.get('retry-after');
  const retryAfterSeconds = Number(retryAfter);
  const retryAfterDate = Date.parse(retryAfter);
  let delayMs = postRetryDelaySeconds * 1000;

  if (retryAfter !== null && Number.isFinite(retryAfterSeconds)) {
    delayMs = retryAfterSeconds * 1000;
  } else if (Number.isFinite(retryAfterDate)) {
    delayMs = Math.max(0, retryAfterDate - Date.now());
  }

  return Math.min(delayMs, 60_000);
}

function getMastodonApiError(response, body) {
  const contentType = response.headers.get('content-type') || '(not provided)';
  const summary = summarizeResponseBody(body) || '(empty response body)';
  const htmlHint = contentType.includes('text/html')
    ? ' The server returned HTML instead of JSON, which usually indicates an instance or upstream proxy error page.'
    : '';

  return (
    `Mastodon API request failed: HTTP ${response.status} ${response.statusText || '(no status text)'}.` +
    `${htmlHint}\nEndpoint: ${response.url}\nContent-Type: ${contentType}\nResponse body: ${summary}`
  );
}

async function findExistingMastodonStatus(postUrl) {
  const headers = {
    Authorization: `Bearer ${token}`
  };

  try {
    const accountResponse = await fetch(`${instance}/api/v1/accounts/verify_credentials`, {
      headers
    });

    if (!accountResponse.ok) {
      console.log(
        `Could not check for an existing Mastodon status: ` +
          `verify_credentials returned HTTP ${accountResponse.status}.`
      );
      return null;
    }

    const account = await accountResponse.json();

    if (!account.id) {
      console.log('Could not check for an existing Mastodon status: account ID was missing.');
      return null;
    }

    const statusesResponse = await fetch(
      `${instance}/api/v1/accounts/${encodeURIComponent(account.id)}/statuses?limit=40&exclude_replies=true`,
      { headers }
    );

    if (!statusesResponse.ok) {
      console.log(
        `Could not check for an existing Mastodon status: ` +
          `account statuses returned HTTP ${statusesResponse.status}.`
      );
      return null;
    }

    const statuses = await statusesResponse.json();
    const existingStatus = statuses.find(status => String(status.content || '').includes(postUrl));

    if (existingStatus) {
      console.log(
        `Found an existing Mastodon status for ${postUrl}: ` +
          `${existingStatus.url || existingStatus.uri}`
      );
    }

    return existingStatus || null;
  } catch (error) {
    console.log(`Could not check for an existing Mastodon status: ${error.message}`);
    return null;
  }
}

async function findExistingMastodonStatusAfterDelay(postUrl, delayMs) {
  await sleep(delayMs);

  return findExistingMastodonStatus(postUrl);
}

async function postToMastodon(status, file, postUrl) {
  if (!instance || !token) {
    throw new Error('MASTODON_INSTANCE and MASTODON_ACCESS_TOKEN are required to post.');
  }

  const existingStatus = await findExistingMastodonStatus(postUrl);

  if (existingStatus) {
    return existingStatus;
  }

  const endpoint = `${instance}/api/v1/statuses`;
  const options = {
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
  };

  for (let attempt = 1; attempt <= postMaxAttempts; attempt += 1) {
    let response;

    try {
      response = await fetch(endpoint, options);
    } catch (error) {
      const retryDelayMs = postRetryDelaySeconds * 1000;

      if (attempt === postMaxAttempts) {
        console.log(
          `Mastodon API request failed before receiving a response. ` +
            `Checking recent account statuses in ${postRetryDelaySeconds}s before failing: ${error.message}`
        );
      } else {
        console.log(
          `Mastodon API request failed before receiving a response. ` +
            `Retrying in ${postRetryDelaySeconds}s (attempt ${attempt}/${postMaxAttempts}): ${error.message}`
        );
      }

      const recoveredStatus = await findExistingMastodonStatusAfterDelay(postUrl, retryDelayMs);

      if (recoveredStatus) {
        return recoveredStatus;
      }

      if (attempt === postMaxAttempts) {
        throw new Error(`Mastodon API request failed for ${endpoint}: ${error.message}`);
      }

      continue;
    }

    const responseBody = await response.text();

    if (response.ok) {
      try {
        return JSON.parse(responseBody);
      } catch {
        throw new Error(
          `Mastodon API returned HTTP ${response.status}, but the response was not valid JSON.\n` +
            `Endpoint: ${response.url}\n` +
            `Content-Type: ${response.headers.get('content-type') || '(not provided)'}\n` +
            `Response body: ${summarizeResponseBody(responseBody) || '(empty response body)'}`
        );
      }
    }

    const errorMessage = getMastodonApiError(response, responseBody);

    if (!isRetryableMastodonStatus(response.status)) {
      throw new Error(errorMessage);
    }

    const retryDelayMs = getMastodonRetryDelayMs(response);

    if (attempt === postMaxAttempts) {
      console.log(
        `${errorMessage}\nChecking recent account statuses in ${retryDelayMs / 1000}s before failing.`
      );

      const recoveredStatus = await findExistingMastodonStatusAfterDelay(postUrl, retryDelayMs);

      if (recoveredStatus) {
        return recoveredStatus;
      }

      throw new Error(errorMessage);
    }

    console.log(
      `${errorMessage}\nRetrying in ${retryDelayMs / 1000}s ` +
        `(attempt ${attempt}/${postMaxAttempts}).`
    );
    const recoveredStatus = await findExistingMastodonStatusAfterDelay(postUrl, retryDelayMs);

    if (recoveredStatus) {
      return recoveredStatus;
    }
  }
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

  await waitForPublishedPost(postUrl, relativePath);

  const mastodonStatus = await postToMastodon(status, file, postUrl);
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
