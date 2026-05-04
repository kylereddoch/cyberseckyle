import EleventyFetch from '@11ty/eleventy-fetch';
import dotenv from 'dotenv';
import sanitizeHtml from 'sanitize-html';

import { author as siteAuthor, creator, url as siteUrl } from './meta.js';

dotenv.config({ path: '.env' });

const API_ORIGIN = 'https://webmention.io/api/mentions.jf2';
const TOKEN = process.env.WEBMENTION_IO_TOKEN;
const PAGE_SIZE = 1000;
const CACHE_DURATION = process.env.ELEVENTY_ENV === 'production' ? '2h' : '15m';
const WEBMENTION_DOMAIN = getHostname(siteAuthor?.website || siteUrl);

const ownMastodonAccounts = [
  creator?.social,
  fediverseHandleToUrl(siteAuthor?.fediverse)
]
  .map(normalizeComparableUrl)
  .filter(Boolean);

const allowedHtml = {
  allowedTags: ['a', 'b', 'br', 'code', 'em', 'i', 'p', 'strong'],
  allowedAttributes: {
    a: ['href']
  }
};

function normalizeTarget(url) {
  if (!url) return '';

  try {
    const parsed = new URL(String(url));
    parsed.hash = '';
    parsed.search = '';

    const pathname = parsed.pathname.replace(/\/+$/, '') || '/';
    return `${parsed.origin}${pathname === '/' ? '/' : pathname}`;
  } catch {
    return String(url)
      .split('#')[0]
      .split('?')[0]
      .replace(/\/+$/, '');
  }
}

function getHostname(url) {
  if (!url) return '';

  try {
    return new URL(String(url)).hostname;
  } catch {
    return '';
  }
}

function normalizeComparableUrl(url) {
  if (!url) return '';

  try {
    const parsed = new URL(String(url));
    parsed.hash = '';
    parsed.search = '';
    parsed.pathname = parsed.pathname.replace(/\/+$/, '') || '/';
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return String(url).trim().replace(/\/+$/, '');
  }
}

function fediverseHandleToUrl(handle) {
  if (!handle) return '';

  const parts = String(handle)
    .trim()
    .replace(/^@/, '')
    .split('@')
    .filter(Boolean);

  if (parts.length !== 2) return '';

  const [username, host] = parts;
  return `https://${host}/@${username}`;
}

function normalizeMastodonStatusUrl(url) {
  if (!url) return '';

  try {
    const parsed = new URL(String(url));
    parsed.hash = '';
    parsed.search = '';
    parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.toString();
  } catch {
    return String(url).split('#')[0].split('?')[0].replace(/\/+$/, '');
  }
}

function isMastodonStatusUrl(url) {
  try {
    const parsed = new URL(String(url));
    return /^\/@[^/]+\/\d+\/?$/.test(parsed.pathname);
  } catch {
    return false;
  }
}

function getOwnMastodonStatusUrl(mention) {
  if (!isMastodonStatusUrl(mention.url)) return false;

  const mentionAuthorUrl = normalizeComparableUrl(mention.author?.url);
  const mentionUrl = normalizeComparableUrl(mention.url);

  if (!ownMastodonAccounts.length) {
    return mention?.['wm-property'] === 'mention-of' ? normalizeMastodonStatusUrl(mention.url) : '';
  }

  const isOwnStatus = ownMastodonAccounts.some(accountUrl => {
    return mentionAuthorUrl === accountUrl || mentionUrl.startsWith(`${accountUrl}/`);
  });

  return isOwnStatus ? normalizeMastodonStatusUrl(mention.url) : '';
}

function getAliasTargets(url) {
  const normalized = normalizeTarget(url);
  if (!normalized) return [];

  if (normalized.endsWith('/')) {
    return [normalized, normalized.slice(0, -1)];
  }

  return [normalized, `${normalized}/`];
}

function toArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function formatDate(value) {
  if (!value) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(value));
  } catch {
    return '';
  }
}

function sanitizeContent(content) {
  if (!content) return { html: '', text: '' };

  const html = content.html ? sanitizeHtml(content.html, allowedHtml) : '';
  const text = String(content.text || '')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    html,
    text: text || sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim()
  };
}

function dedupeMentions(items) {
  const seen = new Set();

  return items.filter(item => {
    const key = item.id || item.url || `${item.author.url || item.author.name}-${item.published || ''}`;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchMentionPage(page = 0) {
  const url = new URL(API_ORIGIN);
  url.searchParams.set('domain', WEBMENTION_DOMAIN);
  url.searchParams.set('token', TOKEN);
  url.searchParams.set('per-page', String(PAGE_SIZE));
  url.searchParams.set('page', String(page));

  return EleventyFetch(url.toString(), {
    duration: CACHE_DURATION,
    type: 'json'
  });
}

async function fetchAllMentions() {
  if (!WEBMENTION_DOMAIN || !TOKEN) {
    return [];
  }

  const mentions = [];
  let page = 0;
  let keepFetching = true;

  while (keepFetching) {
    const response = await fetchMentionPage(page);
    const children = toArray(response?.children);

    mentions.push(...children);

    if (children.length < PAGE_SIZE) {
      keepFetching = false;
    } else {
      page += 1;
    }
  }

  return mentions;
}

function emptyBucket() {
  return {
    all: [],
    likes: [],
    reposts: [],
    bookmarks: [],
    comments: [],
    mentions: [],
    syndicationUrl: '',
    total: 0
  };
}

function mapPropertyToAction(property) {
  switch (property) {
    case 'like-of':
      return 'liked this';
    case 'repost-of':
      return 'reposted this';
    case 'bookmark-of':
      return 'bookmarked this';
    case 'in-reply-to':
      return 'replied';
    default:
      return 'mentioned this';
  }
}

export default async function () {
  if (!TOKEN) {
    return {
      configured: false,
      error: null,
      count: 0,
      byTarget: {}
    };
  }

  try {
    const rawMentions = await fetchAllMentions();
    const grouped = new Map();

    rawMentions
      .filter(mention => !mention['wm-private'])
      .forEach(mention => {
        const normalizedTarget = normalizeTarget(mention['wm-target']);
        if (!normalizedTarget) return;

        if (!grouped.has(normalizedTarget)) {
          grouped.set(normalizedTarget, emptyBucket());
        }

        const bucket = grouped.get(normalizedTarget);
        const content = sanitizeContent(mention.content);
        const normalizedMention = {
          id: mention['wm-id'],
          property: mention['wm-property'],
          url: mention.url || '',
          published: mention.published || mention['wm-received'] || '',
          publishedLabel: formatDate(mention.published || mention['wm-received']),
          action: mapPropertyToAction(mention['wm-property']),
          author: {
            name: mention.author?.name || 'Anonymous',
            url: mention.author?.url || mention.url || '#',
            photo: mention.author?.photo || ''
          },
          contentHtml: content.html,
          contentText: content.text
        };

        bucket.all.push(normalizedMention);

        if (!bucket.syndicationUrl) {
          bucket.syndicationUrl = getOwnMastodonStatusUrl(mention);
        }

        switch (mention['wm-property']) {
          case 'like-of':
            bucket.likes.push(normalizedMention);
            break;
          case 'repost-of':
            bucket.reposts.push(normalizedMention);
            break;
          case 'bookmark-of':
            bucket.bookmarks.push(normalizedMention);
            break;
          case 'in-reply-to':
            bucket.comments.push(normalizedMention);
            break;
          case 'mention-of':
            bucket.mentions.push(normalizedMention);
            bucket.comments.push(normalizedMention);
            break;
        }
      });

    const byTarget = {};
    let count = 0;

    for (const [target, bucket] of grouped.entries()) {
      bucket.likes = dedupeMentions(bucket.likes);
      bucket.reposts = dedupeMentions(bucket.reposts);
      bucket.bookmarks = dedupeMentions(bucket.bookmarks);
      bucket.mentions = dedupeMentions(bucket.mentions);
      bucket.comments = dedupeMentions(bucket.comments).sort((a, b) => {
        return new Date(a.published || 0).getTime() - new Date(b.published || 0).getTime();
      });
      bucket.total =
        bucket.likes.length +
        bucket.reposts.length +
        bucket.bookmarks.length +
        bucket.comments.length;

      count += bucket.total;

      for (const alias of getAliasTargets(target)) {
        if (alias) {
          byTarget[alias] = bucket;
        }
      }
    }

    return {
      configured: true,
      error: null,
      count,
      byTarget
    };
  } catch (error) {
    return {
      configured: true,
      error: error.message,
      count: 0,
      byTarget: {}
    };
  }
}
