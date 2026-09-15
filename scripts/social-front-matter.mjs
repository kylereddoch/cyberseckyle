import yaml from 'js-yaml';

const legacyFields = {
  mastodon: {
    enabled: 'mastodon_post',
    url: 'mastodon_url',
    tags: 'mastodon_tags',
    status: 'mastodon_status'
  },
  x: {
    enabled: 'x_post',
    url: 'x_url',
    tags: 'x_tags',
    status: 'x_status',
    bufferId: 'x_buffer_post_id',
    requiresUrlField: true
  },
  linkedin: {
    enabled: 'linkedin_post',
    url: 'linkedin_url',
    tags: 'linkedin_tags',
    status: 'linkedin_status',
    bufferId: 'linkedin_buffer_post_id',
    requiresUrlField: true
  }
};

function normalizePlatform(value) {
  const platform = String(value || '')
    .trim()
    .toLowerCase();

  return platform === 'twitter' ? 'x' : platform;
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object || {}, key);
}

function cloneValue(value) {
  return value == null ? value : structuredClone(value);
}

function parseTargets(value) {
  if (Array.isArray(value)) {
    return value.map(normalizePlatform).filter(Boolean);
  }

  return String(value || '')
    .split(',')
    .map(normalizePlatform)
    .filter(Boolean);
}

export function usesSocialFrontMatter(data) {
  return Boolean(data?.social && hasOwn(data.social, 'post_to'));
}

export function getSocialTargets(data) {
  return usesSocialFrontMatter(data) ? parseTargets(data.social.post_to) : [];
}

export function getSocialPost(data, platform) {
  const normalizedPlatform = normalizePlatform(platform);
  const post = data?.social?.posts?.[normalizedPlatform];

  if (typeof post === 'string') {
    return {url: post};
  }

  return post && typeof post === 'object' ? post : {};
}

export function getSocialPostUrl(data, platform) {
  if (usesSocialFrontMatter(data)) {
    return String(getSocialPost(data, platform).url || '').trim();
  }

  const field = legacyFields[normalizePlatform(platform)]?.url;
  return field ? String(data?.[field] || '').trim() : '';
}

export function getSocialBufferId(data, platform) {
  if (usesSocialFrontMatter(data)) {
    return String(getSocialPost(data, platform).buffer_id || '').trim();
  }

  const field = legacyFields[normalizePlatform(platform)]?.bufferId;
  return field ? String(data?.[field] || '').trim() : '';
}

export function getSocialTags(data, platform, fallback = []) {
  const normalizedPlatform = normalizePlatform(platform);

  if (usesSocialFrontMatter(data)) {
    return data.social?.platforms?.[normalizedPlatform]?.tags || data.social.tags || fallback;
  }

  const platformField = legacyFields[normalizedPlatform]?.tags;

  if (platformField && data?.[platformField]) {
    return data[platformField];
  }

  if (normalizedPlatform !== 'mastodon' && data?.mastodon_tags) {
    return data.mastodon_tags;
  }

  return fallback;
}

export function getSocialStatus(data, platform) {
  const normalizedPlatform = normalizePlatform(platform);

  if (usesSocialFrontMatter(data)) {
    return String(data.social?.status?.[normalizedPlatform] || '').trim();
  }

  const field = legacyFields[normalizedPlatform]?.status;
  return field ? String(data?.[field] || '').trim() : '';
}

export function shouldPublishTo(data, platform) {
  const normalizedPlatform = normalizePlatform(platform);

  if (usesSocialFrontMatter(data)) {
    return getSocialTargets(data).includes(normalizedPlatform) && !getSocialPostUrl(data, normalizedPlatform);
  }

  const fields = legacyFields[normalizedPlatform];

  if (!fields || data?.[fields.enabled] !== true || getSocialPostUrl(data, normalizedPlatform)) {
    return false;
  }

  return !fields.requiresUrlField || hasOwn(data, fields.url);
}

function yamlQuote(value) {
  return JSON.stringify(String(value));
}

function setHeaderValues(header, eol, values) {
  let updatedHeader = header;

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    const valueLine = `${key}: ${yamlQuote(value)}`;
    const headerPattern = new RegExp(`^${key}:.*$`, 'm');

    if (headerPattern.test(updatedHeader)) {
      updatedHeader = updatedHeader.replace(headerPattern, valueLine);
    } else {
      updatedHeader = `${updatedHeader}${eol}${valueLine}`;
    }
  }

  return updatedHeader;
}

export function setFrontMatterValues(raw, parsed, values) {
  const header = setHeaderValues(parsed.header, parsed.lineEnding, values);
  return `---${parsed.lineEnding}${header}${parsed.lineEnding}---${parsed.lineEnding}${parsed.body}`;
}

function renderFlowMap(value) {
  return yaml
    .dump(value, {
      flowLevel: 0,
      lineWidth: -1,
      noRefs: true,
      quotingType: '"'
    })
    .trim();
}

function replaceSocialPosts(header, posts, eol) {
  const lines = header.split(/\r?\n/);
  const socialStart = lines.findIndex(line => /^social:\s*$/.test(line));

  if (socialStart === -1) {
    throw new Error('The social front matter must use a block beginning with `social:`.');
  }

  let socialEnd = lines.length;

  for (let index = socialStart + 1; index < lines.length; index += 1) {
    if (/^[^\s#][^:]*:/.test(lines[index])) {
      socialEnd = index;
      break;
    }
  }

  const postsStart = lines.findIndex(
    (line, index) => index > socialStart && index < socialEnd && /^  posts:\s*/.test(line)
  );
  const postsLine = `  posts: ${renderFlowMap(posts)}`;

  if (postsStart === -1) {
    lines.splice(socialEnd, 0, postsLine);
    return lines.join(eol);
  }

  let postsEnd = postsStart + 1;

  while (postsEnd < socialEnd && !/^  [A-Za-z0-9_-]+:\s*/.test(lines[postsEnd])) {
    postsEnd += 1;
  }

  lines.splice(postsStart, postsEnd - postsStart, postsLine);
  return lines.join(eol);
}

export function setSocialPostValues(raw, parsed, platform, values, topLevelValues = {}) {
  const normalizedPlatform = normalizePlatform(platform);

  if (!usesSocialFrontMatter(parsed.data)) {
    const fields = legacyFields[normalizedPlatform];
    const legacyValues = {...topLevelValues};

    if (fields?.url && values.url) {
      legacyValues[fields.url] = values.url;
    }

    if (fields?.bufferId && values.buffer_id) {
      legacyValues[fields.bufferId] = values.buffer_id;
    }

    return setFrontMatterValues(raw, parsed, legacyValues);
  }

  const social = cloneValue(parsed.data.social) || {};
  const posts = cloneValue(social.posts) || {};
  const currentPost = getSocialPost(parsed.data, normalizedPlatform);

  posts[normalizedPlatform] = {...currentPost};

  if (values.url) {
    posts[normalizedPlatform].url = String(values.url);
  }

  if (values.buffer_id) {
    posts[normalizedPlatform].buffer_id = String(values.buffer_id);
  }

  let header = replaceSocialPosts(parsed.header, posts, parsed.lineEnding);
  header = setHeaderValues(header, parsed.lineEnding, topLevelValues);

  return `---${parsed.lineEnding}${header}${parsed.lineEnding}---${parsed.lineEnding}${parsed.body}`;
}
