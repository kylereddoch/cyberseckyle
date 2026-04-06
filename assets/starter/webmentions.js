(function() {
  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(value) {
    if (!value) return '';
    try {
      return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  }

  function dedupeByAuthor(items) {
    const seen = new Set();

    return items.filter(item => {
      const key = item?.author?.url || item?.author?.name || item?.url;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async function loadWebmentions() {
    const container = document.getElementById('webmentions-list');
    if (!container) return;

    const currentUrl = window.location.href;

    try {
      const response = await fetch(`https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(currentUrl)}&per-page=100`);
      const data = await response.json();

      if (data.children && data.children.length > 0) {
        displayWebmentions(data.children, container);
      } else {
        showEmptyState(container);
      }
    } catch (error) {
      console.warn('Failed to load webmentions:', error);
      showEmptyState(container);
    }
  }

  function renderFaces(items, label) {
    const uniqueItems = dedupeByAuthor(items);
    if (!uniqueItems.length) return '';

    return `
      <section class="webmention-group">
        <h3 class="webmention-group__title">${escapeHtml(label)}</h3>
        <div class="webmention-faces" role="list" aria-label="${escapeHtml(label)}">
          ${uniqueItems.map(renderFace).join('')}
        </div>
      </section>
    `;
  }

  function renderFace(mention) {
    const author = mention.author || {};
    const authorName = escapeHtml(author.name || 'Anonymous');
    const authorUrl = escapeHtml(author.url || mention.url || '#');
    const authorInitial = authorName.charAt(0).toUpperCase();

    return `
      <a class="webmention-face" href="${authorUrl}" target="_blank" rel="noopener" title="${authorName}">
        ${author.photo
          ? `<img src="${escapeHtml(author.photo)}" alt="${authorName}" loading="lazy" />`
          : `<span class="webmention-face__fallback" aria-hidden="true">${authorInitial}</span><span class="visually-hidden">${authorName}</span>`}
      </a>
    `;
  }

  function renderConversation(mentions) {
    if (!mentions.length) return '';

    return `
      <section class="webmention-comments">
        <h3 class="webmention-comments__title">${mentions.length} ${mentions.length === 1 ? 'Comment' : 'Comments'}</h3>
        <ol class="webmention-comment-list">
          ${mentions.map(renderMention).join('')}
        </ol>
      </section>
    `;
  }

  function displayWebmentions(mentions, container) {
    const likes = mentions.filter(m => m['wm-property'] === 'like-of');
    const reposts = mentions.filter(m => m['wm-property'] === 'repost-of');
    const bookmarks = mentions.filter(m => m['wm-property'] === 'bookmark-of');
    const replies = mentions.filter(m => m['wm-property'] === 'in-reply-to');
    const general = mentions.filter(m => m['wm-property'] === 'mention-of');
    const conversation = [...replies, ...general].sort((a, b) => new Date(a.published || 0) - new Date(b.published || 0));

    let html = '';

    if (likes.length || reposts.length || bookmarks.length) {
      html += '<div class="webmention-summary">';
      if (reposts.length) html += `<span>\uD83D\uDD01 ${reposts.length} ${reposts.length === 1 ? 'Repost' : 'Reposts'}</span>`;
      if (likes.length) html += `<span>\u2764\uFE0F ${likes.length} ${likes.length === 1 ? 'Like' : 'Likes'}</span>`;
      if (bookmarks.length) html += `<span>\uD83D\uDD16 ${bookmarks.length} ${bookmarks.length === 1 ? 'Bookmark' : 'Bookmarks'}</span>`;
      html += '</div>';
    }

    if (reposts.length || likes.length || bookmarks.length) {
      html += '<div class="webmention-grid">';
      html += renderFaces(reposts, `${reposts.length} ${reposts.length === 1 ? 'Repost' : 'Reposts'}`);
      html += renderFaces(likes, `${likes.length} ${likes.length === 1 ? 'Like' : 'Likes'}`);
      html += renderFaces(bookmarks, `${bookmarks.length} ${bookmarks.length === 1 ? 'Bookmark' : 'Bookmarks'}`);
      html += '</div>';
    }

    html += renderConversation(conversation);

    container.innerHTML = html || emptyStateMarkup();
  }

  function renderMention(mention) {
    const author = mention.author || {};
    const content = mention.content || {};
    const published = formatDate(mention.published);
    const authorName = escapeHtml(author.name || 'Anonymous');
    const authorInitial = authorName.charAt(0).toUpperCase();
    const contentText = content.text
      ? escapeHtml(content.text.length > 600 ? `${content.text.substring(0, 600)}...` : content.text)
      : '';
    const authorUrl = escapeHtml(author.url || '#');
    const mentionUrl = escapeHtml(mention.url || author.url || '#');
    const action = mention['wm-property'] === 'in-reply-to' ? 'replied' : 'mentioned this';

    return `
      <li class="webmention-comment">
        <article class="webmention-comment__card">
          <div class="webmention-comment__avatar">
            ${author.photo
              ? `<img src="${escapeHtml(author.photo)}" alt="${authorName}" loading="lazy" />`
              : `<div class="webmention-comment__fallback" aria-hidden="true">${authorInitial}</div>`}
          </div>
          <div class="webmention-comment__body">
            <div class="webmention-comment__meta">
              <a href="${authorUrl}" class="webmention-comment__author" target="_blank" rel="noopener">${authorName}</a>
              <span class="webmention-comment__action">${escapeHtml(action)}</span>
              ${published ? `<time class="webmention-comment__date">${escapeHtml(published)}</time>` : ''}
            </div>
            ${contentText ? `<p class="webmention-comment__content">${contentText}</p>` : ''}
            <a href="${mentionUrl}" class="webmention-comment__link" target="_blank" rel="noopener">View original</a>
          </div>
        </article>
      </li>
    `;
  }

  function emptyStateMarkup() {
    return `
      <div class="text-center py-8 text-gray-500">
        <p>No webmentions yet.</p>
        <p class="text-sm mt-2">Likes, reposts, and replies will show up here when they come in.</p>
      </div>
    `;
  }

  function showEmptyState(container) {
    container.innerHTML = emptyStateMarkup();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWebmentions);
  } else {
    loadWebmentions();
  }
})();
