(function () {
  const root = document.querySelector('.listening-page[data-lastfm-api-key][data-lastfm-username]');

  if (!root) return;

  const apiKey = root.getAttribute('data-lastfm-api-key');
  const username = root.getAttribute('data-lastfm-username');
  const nowPlayingSection = document.getElementById('listening-now-playing');
  const nowPlayingTitle = root.querySelector('[data-listening-now-title]');
  const nowPlayingMeta = root.querySelector('[data-listening-now-meta]');
  const nowPlayingCover = root.querySelector('[data-listening-now-cover]');
  const recentTracksList = document.getElementById('listening-recent-tracks');
  const refreshStatus = document.getElementById('listening-refresh-status');

  if (!apiKey || !username || !recentTracksList) return;

  const endpoint = new URL('https://ws.audioscrobbler.com/2.0/');
  endpoint.searchParams.set('method', 'user.getrecenttracks');
  endpoint.searchParams.set('user', username);
  endpoint.searchParams.set('api_key', apiKey);
  endpoint.searchParams.set('limit', '12');
  endpoint.searchParams.set('format', 'json');

  const escapeHtml = (value) =>
    String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const pickImage = (images) => {
    const ordered = ['extralarge', 'large', 'medium', 'small'];
    for (const size of ordered) {
      const match = (Array.isArray(images) ? images : []).find((image) => image?.size === size && image['#text']);
      if (match) return match['#text'];
    }
    return '';
  };

  const renderTrack = (track) => {
    const title = escapeHtml(track.name || 'Unknown track');
    const artist = escapeHtml(track.artist || 'Unknown artist');
    const album = escapeHtml(track.album || '');
    const image = track.image ? `<img src="${escapeHtml(track.image)}" alt="" class="listening-card__cover" loading="lazy" />` : '';
    const titleMarkup = track.url
      ? `<a href="${escapeHtml(track.url)}" class="font-medium hover:text-fuchsia-600 dark:hover:text-fuchsia-300">${title}</a>`
      : `<p class="font-medium">${title}</p>`;
    const nowBadge = track.nowPlaying
      ? '<span class="rounded-full border border-fuchsia-200 px-2 py-0.5 text-xs text-fuchsia-700 dark:border-fuchsia-800 dark:text-fuchsia-300">Now</span>'
      : '';
    const listenedAt = track.listenedAt && !track.nowPlaying
      ? `<p class="mt-3 text-xs text-gray-500 dark:text-gray-400">${escapeHtml(track.listenedAt)}</p>`
      : '';

    return `
      <li class="listening-track">
        <div class="listening-card__top">
          ${image}
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              ${titleMarkup}
              ${nowBadge}
            </div>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">${artist}</p>
            ${album ? `<p class="text-sm text-gray-500 dark:text-gray-400">${album}</p>` : ''}
          </div>
        </div>
        ${listenedAt}
      </li>
    `;
  };

  const mapTrack = (track) => ({
    name: track?.name || 'Unknown track',
    artist: track?.artist?.['#text'] || 'Unknown artist',
    album: track?.album?.['#text'] || '',
    image: pickImage(track?.image),
    url: track?.url || '',
    nowPlaying: track?.['@attr']?.nowplaying === 'true',
    listenedAt: track?.date?.['#text'] || ''
  });

  const updateNowPlaying = (track) => {
    if (!nowPlayingSection || !nowPlayingTitle || !nowPlayingMeta || !nowPlayingCover) return;

    if (!track || !track.nowPlaying) {
      nowPlayingSection.classList.add('hidden');
      nowPlayingTitle.textContent = '';
      nowPlayingMeta.textContent = '';
      nowPlayingCover.classList.add('hidden');
      nowPlayingCover.removeAttribute('src');
      return;
    }

    nowPlayingSection.classList.remove('hidden');
    nowPlayingTitle.textContent = track.name;
    nowPlayingMeta.textContent = track.album ? `${track.artist} - ${track.album}` : track.artist;

    if (track.image) {
      nowPlayingCover.src = track.image;
      nowPlayingCover.classList.remove('hidden');
    } else {
      nowPlayingCover.classList.add('hidden');
      nowPlayingCover.removeAttribute('src');
    }
  };

  const updateRecentTracks = (tracks) => {
    recentTracksList.innerHTML = tracks.map(renderTrack).join('');
  };

  const updateRefreshStatus = (message, isError = false) => {
    if (!refreshStatus) return;
    refreshStatus.textContent = message;
    refreshStatus.classList.toggle('text-red-500', isError);
    refreshStatus.classList.toggle('dark:text-red-300', isError);
  };

  const refreshTracks = async () => {
    try {
      const url = new URL(endpoint.toString());
      url.searchParams.set('_', String(Date.now()));
      const response = await fetch(url.toString(), { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`Last.fm request failed: ${response.status}`);
      }

      const data = await response.json();
      if (data?.error) {
        throw new Error(data.message || 'Last.fm recent tracks request failed.');
      }

      const tracks = (Array.isArray(data?.recenttracks?.track) ? data.recenttracks.track : [])
        .map(mapTrack);

      updateNowPlaying(tracks.find((track) => track.nowPlaying) || null);
      updateRecentTracks(tracks);
      updateRefreshStatus(`Live Last.fm scrobbles updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.`);
    } catch (error) {
      updateRefreshStatus(`Live Last.fm refresh failed: ${error.message}`, true);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refreshTracks, { once: true });
  } else {
    refreshTracks();
  }

  window.setInterval(refreshTracks, 60000);
})();
