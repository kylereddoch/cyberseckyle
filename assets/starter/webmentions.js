(function() {
  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

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

  function getTargets(section) {
    const explicit = section?.dataset?.webmentionsTarget;
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    const current = `${window.location.origin}${window.location.pathname}`;
    const base = normalizeTarget(explicit || canonical || current);

    if (!base) return [];

    const targets = new Set([base]);

    if (base.endsWith('/')) {
      targets.add(base.slice(0, -1));
    } else {
      targets.add(`${base}/`);
    }

    return [...targets];
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

  function stripHtml(value) {
    return String(value || '').replace(/<[^>]*>/g, ' ');
  }

  function sanitizeText(value) {
    return stripHtml(value).replace(/\s+/g, ' ').trim();
  }

  function toMention(rawMention) {
    const author = rawMention.author || {};
    const content = rawMention.content || {};
    const published = rawMention.published || rawMention['wm-received'] || '';

    return {
      id: rawMention['wm-id'] || rawMention.url || `${author.url || author.name || 'anon'}-${published}`,
      property: rawMention['wm-property'] || '',
      url: rawMention.url || author.url || '#',
      published,
      publishedLabel: formatDate(published),
      action: mapPropertyToAction(rawMention['wm-property']),
      author: {
        name: author.name || 'Anonymous',
        url: author.url || rawMention.url || '#',
        photo: author.photo || ''
      },
      contentText: sanitizeText(content.text || content.html || '')
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

  function dedupeMentions(items) {
    const seen = new Set();

    return items.filter(item => {
      const key = item.id || item.url || `${item.author.url || item.author.name}-${item.published || ''}`;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function dedupeFaces(items) {
    const seen = new Set();

    return items.filter(item => {
      const key = item.author.url || item.author.name || item.url;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async function fetchMentionsForTarget(target) {
    const response = await fetch(`https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(target)}&per-page=100`, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Webmention lookup failed for ${target}: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data?.children) ? data.children : [];
  }

  function renderFacepile(items, id, label) {
    const faces = dedupeFaces(items);
    if (!faces.length) return '';

    return `
      <section class="webmentions__facepile">
        <h3 class="webmentions__hed" id="${escapeHtml(id)}">${escapeHtml(label)}</h3>
        <div class="webmentions__faces" aria-labelledby="${escapeHtml(id)}">
          ${faces.map(renderFace).join('')}
        </div>
      </section>
    `;
  }

  function renderFace(mention) {
    const authorName = escapeHtml(mention.author.name || 'Anonymous');
    const href = escapeHtml(mention.url || mention.author.url || '#');
    const initial = authorName.charAt(0).toUpperCase();

    return `
      <a class="webmentions__face h-card u-url" href="${href}" target="_blank" rel="noopener noreferrer" title="${authorName}">
        ${mention.author.photo
          ? `<img class="u-photo" src="${escapeHtml(mention.author.photo)}" alt="${authorName}" loading="lazy" decoding="async" />`
          : `<span class="webmentions__face-fallback" aria-hidden="true">${escapeHtml(initial)}</span><span class="visually-hidden">${authorName}</span>`}
      </a>
    `;
  }

  function renderComments(items) {
    if (!items.length) return '';

    return `
      <details class="webmentions__thread">
        <summary class="webmentions__summary">
          <span class="webmentions__hed">${items.length} ${items.length === 1 ? 'Comment' : 'Comments'}</span>
        </summary>
        <ol class="webmentions__comment-list">
          ${items.map(renderComment).join('')}
        </ol>
      </details>
    `;
  }

  function renderComment(mention) {
    const authorName = escapeHtml(mention.author.name || 'Anonymous');
    const authorUrl = escapeHtml(mention.author.url || mention.url || '#');
    const mentionUrl = escapeHtml(mention.url || mention.author.url || '#');
    const initial = authorName.charAt(0).toUpperCase();

    return `
      <li class="webmentions__comment">
        <article class="webmentions__comment-card u-comment h-cite">
          <div class="webmentions__comment-avatar">
            ${mention.author.photo
              ? `<img class="u-photo" src="${escapeHtml(mention.author.photo)}" alt="${authorName}" loading="lazy" decoding="async" />`
              : `<span class="webmentions__comment-fallback" aria-hidden="true">${escapeHtml(initial)}</span>`}
          </div>
          <div class="webmentions__comment-body">
            <div class="webmentions__comment-meta">
              <a class="webmentions__comment-author p-author h-card" href="${authorUrl}" target="_blank" rel="noopener noreferrer">${authorName}</a>
              <span class="webmentions__comment-action">${escapeHtml(mention.action)}</span>
              ${mention.published
                ? `<a class="webmentions__comment-date u-url" href="${mentionUrl}" target="_blank" rel="noopener noreferrer"><time class="dt-published" datetime="${escapeHtml(mention.published)}">${escapeHtml(mention.publishedLabel)}</time></a>`
                : ''}
            </div>
            ${mention.contentText ? `<p class="webmentions__comment-content">${escapeHtml(mention.contentText)}</p>` : ''}
            <a class="webmentions__comment-link" href="${mentionUrl}" target="_blank" rel="noopener noreferrer">View original</a>
          </div>
        </article>
      </li>
    `;
  }

  function renderEmptyState() {
    return `
      <div class="text-center py-8 text-gray-500">
        <p>No responses or mentions yet.</p>
        <p class="text-sm mt-2">Likes, reposts, replies, and mentions will show up here when they come in.</p>
      </div>
    `;
  }

  function getOwnMastodonStatusUrl(mention, accountUrl) {
    const account = normalizeComparableUrl(accountUrl);
    if (!isMastodonStatusUrl(mention?.url)) return '';

    if (!account) {
      return mention?.['wm-property'] === 'mention-of' ? normalizeMastodonStatusUrl(mention.url) : '';
    }

    const authorUrl = normalizeComparableUrl(mention.author?.url);
    const mentionUrl = normalizeComparableUrl(mention.url);
    const isOwnStatus = authorUrl === account || mentionUrl.startsWith(`${account}/`);

    return isOwnStatus ? normalizeMastodonStatusUrl(mention.url) : '';
  }

  function findMastodonSyndicationUrl(rawMentions, accountUrl) {
    for (const mention of rawMentions) {
      const statusUrl = getOwnMastodonStatusUrl(mention, accountUrl);

      if (statusUrl) return statusUrl;
    }

    return '';
  }

  function renderMastodonDiscussion(rawMentions) {
    const discussion = document.querySelector('[data-mastodon-discussion]');
    if (!discussion || discussion.dataset.mastodonCurrent) return;

    const statusUrl = findMastodonSyndicationUrl(rawMentions, discussion.dataset.mastodonAccount || '');
    if (!statusUrl) return;

    const escapedStatusUrl = escapeHtml(statusUrl);
    discussion.dataset.mastodonCurrent = statusUrl;
    discussion.classList.remove('hidden');
    discussion.innerHTML = `
      <div class="discuss-mastodon__intro">
        <div class="discuss-mastodon__mark" aria-hidden="true">
          <i class="fa-brands fa-mastodon"></i>
        </div>
        <div class="discuss-mastodon__copy">
          <h3>Discuss on Mastodon</h3>
        </div>
        <a href="${escapedStatusUrl}" rel="syndication noopener" target="_blank" class="discuss-mastodon__button u-syndication no-indicator">Open thread</a>
      </div>
      <mastodon-post url="${escapedStatusUrl}"></mastodon-post>
      <a hidden class="u-syndication" rel="syndication" href="${escapedStatusUrl}">Syndicated on Mastodon</a>
    `;
  }

  function renderMentions(rawMentions) {
    const mentions = dedupeMentions(rawMentions.map(toMention));
    const likes = mentions.filter(mention => mention.property === 'like-of');
    const reposts = mentions.filter(mention => mention.property === 'repost-of');
    const bookmarks = mentions.filter(mention => mention.property === 'bookmark-of');
    const linkedMentions = mentions.filter(mention => mention.property === 'mention-of');
    const comments = mentions
      .filter(mention => mention.property === 'in-reply-to' || mention.property === 'mention-of')
      .sort((a, b) => new Date(a.published || 0).getTime() - new Date(b.published || 0).getTime());

    const parts = [
      renderFacepile(reposts, 'webmentions-reposts-live', `${reposts.length} ${reposts.length === 1 ? 'Repost' : 'Reposts'}`),
      renderFacepile(likes, 'webmentions-likes-live', `${likes.length} ${likes.length === 1 ? 'Like' : 'Likes'}`),
      renderFacepile(bookmarks, 'webmentions-bookmarks-live', `${bookmarks.length} ${bookmarks.length === 1 ? 'Bookmark' : 'Bookmarks'}`),
      renderFacepile(linkedMentions, 'webmentions-mentions-live', `${linkedMentions.length} ${linkedMentions.length === 1 ? 'Mention' : 'Mentions'}`),
      renderComments(comments)
    ].filter(Boolean);

    if (!parts.length) {
      return renderEmptyState();
    }

    return parts.join('');
  }

  async function loadWebmentions() {
    const section = document.getElementById('webmentions');
    const container = document.getElementById('webmentions-list');

    if (!section || !container) return;

    const targets = getTargets(section);
    if (!targets.length) return;

    try {
      const results = await Promise.allSettled(targets.map(fetchMentionsForTarget));
      const mentions = [];
      const seen = new Set();

      results.forEach(result => {
        if (result.status !== 'fulfilled') return;

        result.value.forEach(mention => {
          const key = mention['wm-id'] || mention.url || `${mention.author?.url || mention.author?.name || 'anon'}-${mention.published || mention['wm-received'] || ''}`;
          if (!key || seen.has(key)) return;
          seen.add(key);
          mentions.push(mention);
        });
      });

      container.innerHTML = renderMentions(mentions);
      renderMastodonDiscussion(mentions);
    } catch (error) {
      console.warn('Failed to load webmentions live:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWebmentions);
  } else {
    loadWebmentions();
  }
})();
