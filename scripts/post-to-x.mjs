import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import slugify from 'slugify';

import {author as siteAuthor, url as configuredSiteUrl} from '../src/_data/meta.js';

const root = process.cwd();
const bufferEndpoint = 'https://api.buffer.com';
const defaultSearchRoots = [path.join(root, 'src', 'posts'), path.join(root, 'src', 'notes')];
const dryRun =
  process.argv.includes('--dry-run') || String(process.env.X_DRY_RUN || '').toLowerCase() === 'true';
const siteUrl = stripTrailingSlash(process.env.X_SITE_URL || siteAuthor?.website || configuredSiteUrl);
const bufferApiKey = String(process.env.BUFFER_API_KEY || '').trim();
const configuredChannelId = String(process.env.BUFFER_X_CHANNEL_ID || '').trim();
const configuredChannelName = String(process.env.BUFFER_X_CHANNEL_NAME || '')
  .trim()
  .replace(/^@/, '')
  .toLowerCase();
const statusLimit = Number(process.env.X_STATUS_LIMIT || 280);
const waitForPublicUrl = String(process.env.X_WAIT_FOR_PUBLIC_URL || 'true').toLowerCase() !== 'false';
const waitTimeoutSeconds = Number(process.env.X_WAIT_TIMEOUT_SECONDS || 360);
const waitIntervalSeconds = Number(process.env.X_WAIT_INTERVAL_SECONDS || 10);
const bufferWaitTimeoutSeconds = Number(process.env.BUFFER_WAIT_TIMEOUT_SECONDS || 120);
const bufferWaitIntervalSeconds = Number(process.env.BUFFER_WAIT_INTERVAL_SECONDS || 5);

let selectedChannel;

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

function normalizeSlug(value) {
  return String(value || '')
    .trim()
    .replace(/^\/+|\/+$/g, '');
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
    .map(tag =>
      String(tag)
        .replace(/^#/, '')
        .replace(/[^A-Za-z0-9_]/g, '')
    )
    .filter(Boolean)
    .map(tag => `#${tag}`)
    .join(' ');
}

function truncateAtWord(value, maxLength) {
  const text = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, Math.max(0, maxLength - 1)).trimEnd();
  const lastSpace = truncated.lastIndexOf(' ');

  return `${(lastSpace > 40 ? truncated.slice(0, lastSpace) : truncated).trim()}…`;
}

function yamlQuote(value) {
  return JSON.stringify(String(value));
}

function walkMarkdownFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = [];

  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
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

function isFutureDated(data) {
  if (!data.date) {
    return false;
  }

  const publishDate = new Date(data.date);
  return !Number.isNaN(publishDate.getTime()) && publishDate > new Date();
}

function getPostUrl(file, data) {
  const relativePath = normalizePath(path.relative(root, file));

  if (data.permalink) {
    return new URL(String(data.permalink).replace(/index\.html$/, ''), `${siteUrl}/`).toString();
  }

  if (relativePath.startsWith('src/posts/weeklynotes/')) {
    const slug = relativePath.replace(/^src\/posts\/weeklynotes\//, '').replace(/\.md$/, '/');

    return `${siteUrl}/notes/${slug}`;
  }

  if (relativePath.startsWith('src/notes/')) {
    return `${siteUrl}/notes/${path.basename(file, '.md')}/`;
  }

  return `${siteUrl}/blog/${normalizeSlug(data.slug) || slugifyTitle(data.title)}/`;
}

function getStatusText(data, postUrl) {
  const title = String(data.title || '').trim();
  const tags = formatTags(data.x_tags || data.mastodon_tags || []);
  const customStatus = String(data.x_status || '').trim();

  if (customStatus) {
    return customStatus
      .replaceAll('{title}', title)
      .replaceAll('{description}', String(data.description || '').trim())
      .replaceAll('{url}', postUrl);
  }

  const suffix = [postUrl, tags].filter(Boolean).join('\n\n');
  const headingPrefix = 'New by me: ';
  const availableTitleLength = statusLimit - headingPrefix.length - suffix.length - 2;
  const heading = `${headingPrefix}${truncateAtWord(title, availableTitleLength)}`;

  return [heading, suffix].filter(Boolean).join('\n\n');
}

function setFrontMatterValues(raw, parsed, values) {
  const eol = parsed.lineEnding;
  let header = parsed.header;

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    const valueLine = `${key}: ${yamlQuote(value)}`;
    const headerPattern = new RegExp(`^${key}:.*$`, 'm');

    if (headerPattern.test(header)) {
      header = header.replace(headerPattern, valueLine);
    } else {
      header = `${header}${eol}${valueLine}`;
    }
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
  const response = await fetch(url, {redirect: 'follow'});

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
        `Waiting for ${relativePath} to be live before posting to X through Buffer ` +
          `(attempt ${attempt}): ${lastError}`
      );
      await sleep(waitIntervalSeconds * 1000);
    }
  }

  throw new Error(
    `Timed out after ${waitTimeoutSeconds}s waiting for ${relativePath} to be publicly available. ` +
      `Checked URL: ${postUrl}. Last check: ${lastError}. ` +
      `The article must be live before Buffer posts it to X.`
  );
}

function summarize(value, maxLength = 700) {
  const text = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();

  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
}

async function bufferRequest(query, variables = {}) {
  if (!bufferApiKey) {
    throw new Error('BUFFER_API_KEY is required to post to X through Buffer.');
  }

  const response = await fetch(bufferEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bufferApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({query, variables})
  });
  const responseBody = await response.text();
  let payload;

  try {
    payload = JSON.parse(responseBody);
  } catch {
    throw new Error(`Buffer returned HTTP ${response.status} with invalid JSON: ${summarize(responseBody)}`);
  }

  if (!response.ok || payload.errors?.length) {
    const errors = payload.errors?.map(error => error.message).join('; ');
    throw new Error(
      `Buffer API request failed (HTTP ${response.status}): ${errors || summarize(responseBody)}`
    );
  }

  return payload.data;
}

function channelLabel(channel) {
  return `@${channel.name || channel.displayName || channel.id}`;
}

function validateXChannel(channel) {
  if (!channel) {
    throw new Error('The configured Buffer channel was not found.');
  }

  if (channel.service !== 'twitter') {
    throw new Error(`Buffer channel ${channel.id} is a ${channel.service} channel, not an X channel.`);
  }

  if (channel.isDisconnected) {
    throw new Error(`Buffer reports that X channel ${channelLabel(channel)} is disconnected.`);
  }

  if (channel.isLocked) {
    throw new Error(`Buffer reports that X channel ${channelLabel(channel)} is locked.`);
  }

  return channel;
}

async function getXChannel() {
  if (selectedChannel) {
    return selectedChannel;
  }

  const channelFields = `
    id
    name
    displayName
    service
    isDisconnected
    isLocked
  `;

  if (configuredChannelId) {
    const data = await bufferRequest(`
      query {
        channel(input: { id: ${JSON.stringify(configuredChannelId)} }) {
          ${channelFields}
        }
      }
    `);

    selectedChannel = validateXChannel(data.channel);
    console.log(`Using Buffer X channel ${channelLabel(selectedChannel)} (${selectedChannel.id}).`);
    return selectedChannel;
  }

  const accountData = await bufferRequest(`
    query {
      account {
        organizations {
          id
        }
      }
    }
  `);
  const organizations = accountData.account?.organizations || [];
  const channels = [];

  for (const organization of organizations) {
    const data = await bufferRequest(`
      query {
        channels(input: { organizationId: ${JSON.stringify(organization.id)} }) {
          ${channelFields}
        }
      }
    `);
    channels.push(...(data.channels || []));
  }

  let xChannels = channels.filter(
    channel => channel.service === 'twitter' && !channel.isDisconnected && !channel.isLocked
  );

  if (configuredChannelName) {
    xChannels = xChannels.filter(channel =>
      [channel.name, channel.displayName]
        .filter(Boolean)
        .some(name => String(name).replace(/^@/, '').toLowerCase() === configuredChannelName)
    );
  }

  if (!xChannels.length) {
    const nameHint = configuredChannelName ? ` matching @${configuredChannelName}` : '';
    throw new Error(`No connected, unlocked X channel${nameHint} was found in Buffer.`);
  }

  if (xChannels.length > 1) {
    const choices = xChannels.map(channel => `${channelLabel(channel)} (${channel.id})`).join(', ');
    throw new Error(
      `Multiple X channels were found in Buffer: ${choices}. ` + `Set BUFFER_X_CHANNEL_ID to select one.`
    );
  }

  selectedChannel = xChannels[0];
  console.log(`Using Buffer X channel ${channelLabel(selectedChannel)} (${selectedChannel.id}).`);
  return selectedChannel;
}

async function createBufferPost(status) {
  const channel = await getXChannel();
  const data = await bufferRequest(
    `
      mutation PublishXPost($input: CreatePostInput!) {
        createPost(input: $input) {
          __typename
          ... on PostActionSuccess {
            post {
              id
              status
              externalLink
              sentAt
            }
          }
          ... on MutationError {
            message
          }
        }
      }
    `,
    {
      input: {
        text: status,
        channelId: channel.id,
        schedulingType: 'automatic',
        mode: 'shareNow',
        assets: []
      }
    }
  );
  const result = data.createPost;

  if (result?.__typename !== 'PostActionSuccess' || !result.post?.id) {
    throw new Error(`Buffer could not create the X post: ${result?.message || 'unknown error'}`);
  }

  return result.post;
}

async function getBufferPost(postId) {
  const data = await bufferRequest(`
    query {
      post(input: { id: ${JSON.stringify(postId)} }) {
        id
        status
        externalLink
        sentAt
        error {
          message
        }
      }
    }
  `);

  if (!data.post?.id) {
    throw new Error(`Buffer post ${postId} was not found.`);
  }

  return data.post;
}

async function waitForBufferPost(post) {
  if (post.externalLink) {
    return post;
  }

  const deadline = Date.now() + bufferWaitTimeoutSeconds * 1000;
  let currentPost = post;

  while (Date.now() < deadline) {
    if (currentPost.status === 'error') {
      console.warn(
        `::warning::Buffer reported a publishing error for post ${currentPost.id}: ` +
          `${currentPost.error?.message || 'unknown publishing error'}. ` +
          `The Buffer ID has been retained so another workflow run will not create a duplicate.`
      );
      return currentPost;
    }

    await sleep(bufferWaitIntervalSeconds * 1000);
    currentPost = await getBufferPost(post.id);

    if (currentPost.externalLink) {
      return currentPost;
    }
  }

  console.log(
    `Buffer accepted post ${post.id}, but its X URL was not available after ` +
      `${bufferWaitTimeoutSeconds}s. The Buffer ID will be saved so a later run can recover it ` +
      `without creating a duplicate.`
  );
  return currentPost;
}

async function publishFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = parseFrontMatter(raw, file);

  if (!parsed) {
    return null;
  }

  const data = parsed.data;
  const relativePath = normalizePath(path.relative(root, file));
  const hasXUrlField = Object.prototype.hasOwnProperty.call(data, 'x_url');

  if (
    data.draft ||
    isFutureDated(data) ||
    data.x_post !== true ||
    !hasXUrlField ||
    String(data.x_url || '').trim()
  ) {
    return null;
  }

  if (!data.title) {
    throw new Error(`${relativePath} has x_post: true but no title.`);
  }

  const postUrl = getPostUrl(file, data);
  const status = getStatusText(data, postUrl);

  if (status.length > statusLimit) {
    throw new Error(
      `${relativePath} generated a ${status.length}-character X post. Limit is ${statusLimit}.`
    );
  }

  if (dryRun) {
    console.log(`[dry-run] Would post ${relativePath} to X immediately through Buffer`);
    console.log(status);
    return {file: relativePath, xUrl: 'dry-run', postUrl};
  }

  let bufferPost;
  const existingBufferPostId = String(data.x_buffer_post_id || '').trim();

  if (existingBufferPostId) {
    console.log(`Recovering existing Buffer post ${existingBufferPostId} for ${relativePath}.`);
    bufferPost = await getBufferPost(existingBufferPostId);
  } else {
    await waitForPublishedPost(postUrl, relativePath);
    bufferPost = await createBufferPost(status);
    fs.writeFileSync(
      file,
      setFrontMatterValues(raw, parsed, {x_buffer_post_id: bufferPost.id}),
      'utf8'
    );
    console.log(`Buffer accepted ${relativePath} for immediate X publishing: ${bufferPost.id}`);
  }

  bufferPost = await waitForBufferPost(bufferPost);

  const values = {
    x_buffer_post_id: bufferPost.id,
    x_url: bufferPost.externalLink
  };

  fs.writeFileSync(file, setFrontMatterValues(raw, parsed, values), 'utf8');

  if (bufferPost.externalLink) {
    console.log(`Posted ${relativePath} to X through Buffer: ${bufferPost.externalLink}`);
  }

  return {
    file: relativePath,
    xUrl: bufferPost.externalLink || '',
    bufferPostId: bufferPost.id,
    postUrl
  };
}

const results = [];
const failures = [];

for (const file of getCandidateFiles()) {
  try {
    const result = await publishFile(file);

    if (result) {
      results.push(result);
    }
  } catch (error) {
    const relativePath = normalizePath(path.relative(root, file));
    failures.push(relativePath);
    console.warn(`::warning::X posting failed for ${relativePath}: ${error.message}`);
  }
}

setGitHubOutput('posted_count', results.length);
setGitHubOutput('posted_files', results.map(result => result.file).join(' '));
setGitHubOutput('failed_count', failures.length);
setGitHubOutput('failed_files', failures.join(' '));

if (!results.length) {
  console.log('No eligible posts found for X through Buffer.');
}

if (failures.length) {
  console.warn(
    `X posting finished with ${failures.length} warning(s). The site deployment remains successful.`
  );
}
