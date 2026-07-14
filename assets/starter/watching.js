(function () {
  const root = document.querySelector('.watching-page[data-watching-api-url]');
  if (!root) return;

  const endpoint = root.getAttribute('data-watching-api-url');
  const refreshStatus = root.querySelector('[data-watching-refresh-status]');
  const buildError = root.querySelector('[data-watching-build-error]');
  const profileLink = root.querySelector('[data-watching-profile-link]');
  const posterCredit = root.querySelector('[data-watching-poster-credit]');
  const tmdbAttribution = root.querySelector('[data-watching-tmdb-attribution]');
  const refreshInterval = 30 * 60 * 1000;
  let lastAttempt = 0;
  let activeRequest = null;

  if (!endpoint) return;

  const createElement = (tagName, className, text) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = String(text);
    return element;
  };

  const getSafeUrl = (value, allowedOrigin, fallback) => {
    try {
      const url = new URL(String(value || ''));
      return url.origin === allowedOrigin ? url.toString() : fallback;
    } catch {
      return fallback;
    }
  };

  const getTraktUrl = (value) => getSafeUrl(value, 'https://trakt.tv', 'https://trakt.tv');
  const getPosterUrl = (value) => getSafeUrl(value, 'https://image.tmdb.org', '');

  const formatDate = (value) => {
    const date = new Date(value);
    if (!value || Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatDateTime = (value) => {
    const date = new Date(value);
    if (!value || Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const createPoster = (item, className) => {
    const posterUrl = getPosterUrl(item.poster);

    if (posterUrl) {
      const image = createElement('img');
      image.src = posterUrl;
      image.alt = '';
      image.loading = 'lazy';
      return image;
    }

    const fallback = createElement('span');
    fallback.setAttribute('aria-hidden', 'true');
    fallback.textContent = item.kind === 'movie' ? '\uD83C\uDFAC' : '\uD83D\uDCFA';
    if (className) fallback.className = className;
    return fallback;
  };

  const createRecentCard = (item) => {
    const card = createElement('li', 'watching-recent-card');
    const posterLink = createElement('a', 'watching-recent-card__poster');
    posterLink.href = getTraktUrl(item.url);
    posterLink.setAttribute('aria-label', `View ${item.title || 'this title'} on Trakt`);
    posterLink.append(createPoster(item));

    const body = createElement('div', 'min-w-0 flex-1');
    const header = createElement('div', 'watching-recent-card__header');
    header.append(createElement('span', 'watching-kind-badge', item.label || (item.kind === 'movie' ? 'Movie' : 'TV')));

    const watchedAt = formatDate(item.watchedAt);
    if (watchedAt) header.append(createElement('span', '', watchedAt));

    const titleLink = createElement('a', 'watching-recent-card__title hover:text-rose-600 dark:hover:text-rose-300', item.title || 'Untitled');
    titleLink.href = getTraktUrl(item.url);
    body.append(header, titleLink);

    if (item.subtitle) {
      body.append(createElement('p', 'watching-recent-card__meta', item.subtitle));
    }
    if (item.year) {
      body.append(createElement('p', 'watching-recent-card__meta', item.year));
    }

    card.append(posterLink, body);
    return card;
  };

  const createPosterCard = (item, type) => {
    const card = createElement('li', 'watching-poster-card');
    const mediaLink = createElement('a', 'watching-poster-card__media');
    mediaLink.href = getTraktUrl(item.url);
    mediaLink.setAttribute('aria-label', `View ${item.title || 'this title'} on Trakt`);
    mediaLink.append(createPoster(item));

    const body = createElement('div', 'watching-poster-card__body');
    const hoverClass = type === 'shows'
      ? 'hover:text-sky-600 dark:hover:text-sky-300'
      : 'hover:text-rose-600 dark:hover:text-rose-300';
    const titleLink = createElement('a', `watching-poster-card__title ${hoverClass}`, item.title || 'Untitled');
    titleLink.href = getTraktUrl(item.url);
    body.append(titleLink);

    const watchedAt = formatDate(item.watchedAt);
    const metaParts = [];
    if (watchedAt) metaParts.push(type === 'shows' ? `Last watched ${watchedAt}` : watchedAt);
    if (item.year) metaParts.push(String(item.year));
    body.append(createElement('p', 'watching-poster-card__meta', metaParts.join(' \u00B7 ')));

    card.append(mediaLink, body);
    return card;
  };

  const updateCollection = (name, items, renderer, countLabel) => {
    const list = document.getElementById(`watching-${name}-list`);
    const empty = root.querySelector(`[data-watching-empty="${name}"]`);
    const count = root.querySelector(`[data-watching-count="${name}"]`);
    const safeItems = Array.isArray(items) ? items : [];

    if (list) {
      list.replaceChildren(...safeItems.map(renderer));
      list.classList.toggle('hidden', safeItems.length === 0);
    }
    if (empty) empty.classList.toggle('hidden', safeItems.length > 0);
    if (count) count.textContent = `${safeItems.length} ${countLabel}`;
  };

  const updateStatus = (message, isError) => {
    if (!refreshStatus) return;
    refreshStatus.textContent = message;
    refreshStatus.classList.toggle('text-red-500', Boolean(isError));
    refreshStatus.classList.toggle('dark:text-red-300', Boolean(isError));
  };

  const applySnapshot = (data) => {
    ['movies', 'shows', 'episodes'].forEach((name) => {
      const stat = root.querySelector(`[data-watching-stat="${name}"]`);
      if (stat) stat.textContent = String(data?.stats?.[name] ?? 0);
    });

    updateCollection('recent', data.recentActivity, createRecentCard, 'items');
    updateCollection('movies', data.movies, (item) => createPosterCard(item, 'movies'), 'synced');
    updateCollection('shows', data.shows, (item) => createPosterCard(item, 'shows'), 'synced');

    if (profileLink) profileLink.href = getTraktUrl(data.profileUrl);
    if (posterCredit) posterCredit.classList.toggle('hidden', !data.posterConfigured);
    if (tmdbAttribution) tmdbAttribution.classList.toggle('hidden', !data.posterConfigured);
    if (buildError) buildError.classList.add('hidden');

    const updatedAt = formatDateTime(data.updatedAt);
    updateStatus(updatedAt ? `Live Trakt data updated ${updatedAt}.` : 'Live Trakt data updated.', false);
  };

  const refreshWatching = async () => {
    if (activeRequest || (document.hidden && lastAttempt > 0)) return activeRequest;
    lastAttempt = Date.now();

    activeRequest = (async () => {
      try {
        const response = await fetch(endpoint, {
          cache: 'no-store',
          headers: { accept: 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (!data?.configured) {
          throw new Error(data?.error || 'Trakt data was not returned');
        }

        applySnapshot(data);
      } catch (error) {
        updateStatus(`Live Trakt refresh failed; showing the last site copy. ${error.message}`, true);
      } finally {
        activeRequest = null;
      }
    })();

    return activeRequest;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refreshWatching, { once: true });
  } else {
    refreshWatching();
  }

  window.setInterval(refreshWatching, refreshInterval);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && Date.now() - lastAttempt >= refreshInterval) {
      refreshWatching();
    }
  });
})();
