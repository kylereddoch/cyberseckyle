const TRAKT_API_URL = 'https://api.trakt.tv';
const TRAKT_SITE_URL = 'https://trakt.tv';
const TMDB_API_URL = 'https://api.themoviedb.org/3/';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342';

const SNAPSHOT_KEY = 'watching:snapshot';
const POSTER_CACHE_KEY = 'watching:posters';
const TOKEN_STATE_KEY = 'watching:trakt-tokens';
const SNAPSHOT_MAX_AGE_MS = 45 * 60 * 1000;
const DISPLAY_LIMIT = 12;

class UpstreamError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'UpstreamError';
    this.status = status;
  }
}

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const buildUrl = (baseUrl, path, params = {}) => {
  const url = new URL(path, baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url;
};

const sortByWatchedDateDesc = (left, right) => {
  const leftValue = left?.watchedAt ? new Date(left.watchedAt).getTime() : 0;
  const rightValue = right?.watchedAt ? new Date(right.watchedAt).getTime() : 0;
  return rightValue - leftValue;
};

const hasKv = (env) => Boolean(env.WATCHING_DATA?.get && env.WATCHING_DATA?.put);

const getKvJson = async (env, key) => {
  if (!hasKv(env)) return null;

  try {
    return await env.WATCHING_DATA.get(key, { type: 'json' });
  } catch {
    return null;
  }
};

const putKvJson = async (env, key, value) => {
  if (!hasKv(env)) return;
  await env.WATCHING_DATA.put(key, JSON.stringify(value));
};

const getAllowedOrigin = (request, env) => {
  const origin = request.headers.get('origin');
  if (!origin) return '';

  const configuredOrigins = String(env.SITE_ORIGIN || 'https://www.kylereddoch.me')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

  return configuredOrigins.includes(origin) || isLocal ? origin : null;
};

const jsonResponse = (request, env, body, status = 200, extraHeaders = {}) => {
  const allowedOrigin = getAllowedOrigin(request, env);
  const headers = new Headers({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...extraHeaders
  });

  if (allowedOrigin) {
    headers.set('access-control-allow-origin', allowedOrigin);
    headers.set('access-control-allow-methods', 'GET, OPTIONS');
    headers.set('access-control-allow-headers', 'Accept, Content-Type');
    headers.set('vary', 'Origin');
  }

  const payload = status === 204 ? null : JSON.stringify(body);
  return new Response(payload, { status, headers });
};

const getTraktHeaders = (clientId, accessToken) => {
  const headers = {
    'content-type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': clientId,
    'user-agent': 'cyberseckyle-watching/1.0 (+https://www.kylereddoch.me/watching/)'
  };

  if (accessToken) {
    headers.authorization = `Bearer ${accessToken}`;
  }

  return headers;
};

const traktRequest = async (path, params, clientId, accessToken) => {
  const response = await fetch(buildUrl(TRAKT_API_URL, path, params), {
    headers: getTraktHeaders(clientId, accessToken)
  });

  if (!response.ok) {
    throw new UpstreamError(`Trakt request failed for ${path}.`, response.status);
  }

  return response.json();
};

const loadTokenState = async (env) => {
  const stored = await getKvJson(env, TOKEN_STATE_KEY);

  return {
    accessToken: stored?.accessToken || String(env.TRAKT_ACCESS_TOKEN || '').trim(),
    refreshToken: stored?.refreshToken || String(env.TRAKT_REFRESH_TOKEN || '').trim(),
    createdAt: Number(stored?.createdAt || 0),
    expiresIn: Number(stored?.expiresIn || 0)
  };
};

const shouldRefreshToken = (tokenState) => {
  if (!tokenState.accessToken || !tokenState.createdAt || !tokenState.expiresIn) return false;
  const refreshAt = tokenState.createdAt + tokenState.expiresIn - 24 * 60 * 60;
  return Date.now() / 1000 >= refreshAt;
};

const refreshTraktToken = async (env, refreshToken) => {
  const clientId = String(env.TRAKT_CLIENT_ID || '').trim();
  const clientSecret = String(env.TRAKT_CLIENT_SECRET || '').trim();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Trakt token refresh is not configured.');
  }

  const response = await fetch(`${TRAKT_API_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      grant_type: 'refresh_token'
    })
  });

  if (!response.ok) {
    throw new UpstreamError('Trakt token refresh failed.', response.status);
  }

  const payload = await response.json();
  const tokenState = {
    accessToken: payload.access_token || '',
    refreshToken: payload.refresh_token || refreshToken,
    createdAt: Number(payload.created_at || Math.floor(Date.now() / 1000)),
    expiresIn: Number(payload.expires_in || 0)
  };

  await putKvJson(env, TOKEN_STATE_KEY, tokenState);
  return tokenState;
};

const getTraktPayload = async (env, tokenState) => {
  const clientId = String(env.TRAKT_CLIENT_ID || '').trim();
  const username = String(env.TRAKT_USERNAME || '').trim();
  const userId = tokenState.accessToken ? 'me' : username;

  if (!clientId || !userId) {
    throw new Error('Trakt credentials are not configured.');
  }

  const params = { page: 1, limit: DISPLAY_LIMIT, extended: 'full' };
  const [stats, movieHistory, episodeHistory, watchedMovies, watchedShows] = await Promise.all([
    traktRequest(`/users/${userId}/stats`, {}, clientId, tokenState.accessToken),
    traktRequest(`/users/${userId}/history/movies`, params, clientId, tokenState.accessToken),
    traktRequest(`/users/${userId}/history/episodes`, params, clientId, tokenState.accessToken),
    traktRequest(`/users/${userId}/watched/movies`, params, clientId, tokenState.accessToken),
    traktRequest(`/users/${userId}/watched/shows`, params, clientId, tokenState.accessToken)
  ]);

  return { stats, movieHistory, episodeHistory, watchedMovies, watchedShows };
};

const loadTraktPayload = async (env) => {
  let tokenState = await loadTokenState(env);

  if (shouldRefreshToken(tokenState)) {
    tokenState = await refreshTraktToken(env, tokenState.refreshToken);
  }

  try {
    return await getTraktPayload(env, tokenState);
  } catch (error) {
    if (error.status !== 401 || !tokenState.refreshToken) throw error;
    tokenState = await refreshTraktToken(env, tokenState.refreshToken);
    return getTraktPayload(env, tokenState);
  }
};

const getTraktSlug = (item) => item?.ids?.slug || '';

const getTraktUrl = (type, item) => {
  const slug = getTraktSlug(item);
  return slug ? `${TRAKT_SITE_URL}/${type}/${encodeURIComponent(slug)}` : TRAKT_SITE_URL;
};

const mapMovie = (entry) => {
  const movie = entry?.movie || {};

  return {
    kind: 'movie',
    label: 'Movie',
    title: movie.title || 'Untitled movie',
    year: movie.year || null,
    watchedAt: entry.watched_at || entry.last_watched_at || null,
    plays: entry.plays || 1,
    url: getTraktUrl('movies', movie),
    poster: null,
    tmdbType: 'movie',
    tmdbId: movie?.ids?.tmdb || null
  };
};

const mapShow = (entry) => {
  const show = entry?.show || {};

  return {
    kind: 'show',
    label: 'TV',
    title: show.title || 'Untitled show',
    year: show.year || null,
    watchedAt: entry.last_watched_at || entry.watched_at || null,
    plays: entry.plays || 1,
    url: getTraktUrl('shows', show),
    poster: null,
    tmdbType: 'tv',
    tmdbId: show?.ids?.tmdb || null
  };
};

const mapEpisode = (entry) => {
  const show = entry?.show || {};
  const episode = entry?.episode || {};
  const hasSeason = episode.season !== undefined && episode.season !== null;
  const hasNumber = episode.number !== undefined && episode.number !== null;
  const season = hasSeason ? `S${String(episode.season).padStart(2, '0')}` : '';
  const number = hasNumber ? `E${String(episode.number).padStart(2, '0')}` : '';
  const episodePrefix = `${season}${number}`;

  return {
    kind: 'episode',
    label: 'TV',
    title: show.title || 'Untitled show',
    subtitle: [episodePrefix, episode.title].filter(Boolean).join(': '),
    year: show.year || null,
    watchedAt: entry.watched_at || null,
    url: getTraktUrl('shows', show),
    poster: null,
    tmdbType: 'tv',
    tmdbId: show?.ids?.tmdb || null
  };
};

const getTmdbAuth = (env) => {
  const readAccessToken = String(env.TMDB_READ_ACCESS_TOKEN || '').trim();
  const apiKey = String(env.TMDB_API_KEY || '').trim();

  if (readAccessToken) {
    return {
      configured: true,
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${readAccessToken}`
      },
      params: {}
    };
  }

  if (apiKey) {
    return {
      configured: true,
      headers: { accept: 'application/json' },
      params: { api_key: apiKey }
    };
  }

  return { configured: false, headers: {}, params: {} };
};

const fetchTmdbPoster = async (tmdbType, tmdbId, auth) => {
  if (!auth.configured || !tmdbId) return null;

  try {
    const response = await fetch(
      buildUrl(TMDB_API_URL, `${tmdbType}/${tmdbId}`, auth.params),
      { headers: auth.headers }
    );

    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.poster_path ? `${TMDB_IMAGE_BASE_URL}${payload.poster_path}` : null;
  } catch {
    return null;
  }
};

const addPosters = async (env, collections, auth) => {
  if (!auth.configured) return collections;

  const posterCache = (await getKvJson(env, POSTER_CACHE_KEY)) || {};
  const targets = new Map();

  collections.flat().forEach((item) => {
    if (!item.tmdbId) return;
    const key = `${item.tmdbType}:${item.tmdbId}`;
    if (!Object.prototype.hasOwnProperty.call(posterCache, key)) {
      targets.set(key, item);
    }
  });

  if (targets.size > 0) {
    await Promise.all([...targets.entries()].map(async ([key, item]) => {
      posterCache[key] = await fetchTmdbPoster(item.tmdbType, item.tmdbId, auth);
    }));
    await putKvJson(env, POSTER_CACHE_KEY, posterCache);
  }

  return collections.map((items) => items.map((item) => ({
    ...item,
    poster: item.tmdbId ? posterCache[`${item.tmdbType}:${item.tmdbId}`] || null : null
  })));
};

const toPublicItem = ({ tmdbType, tmdbId, ...item }) => item;

const buildSnapshot = async (env) => {
  const payload = await loadTraktPayload(env);
  const recentMovies = toArray(payload.movieHistory).map(mapMovie);
  const recentEpisodes = toArray(payload.episodeHistory).map(mapEpisode);
  const recentActivity = [...recentMovies, ...recentEpisodes]
    .sort(sortByWatchedDateDesc)
    .slice(0, DISPLAY_LIMIT);
  const movies = toArray(payload.watchedMovies)
    .map(mapMovie)
    .sort(sortByWatchedDateDesc)
    .slice(0, DISPLAY_LIMIT);
  const shows = toArray(payload.watchedShows)
    .map(mapShow)
    .sort(sortByWatchedDateDesc)
    .slice(0, DISPLAY_LIMIT);
  const tmdbAuth = getTmdbAuth(env);
  const [recentWithPosters, moviesWithPosters, showsWithPosters] = await addPosters(
    env,
    [recentActivity, movies, shows],
    tmdbAuth
  );
  const username = String(env.TRAKT_USERNAME || '').trim();

  return {
    configured: true,
    error: null,
    username: username || null,
    profileUrl: username ? `${TRAKT_SITE_URL}/users/${encodeURIComponent(username)}` : TRAKT_SITE_URL,
    posterConfigured: tmdbAuth.configured,
    recentActivity: recentWithPosters.map(toPublicItem),
    movies: moviesWithPosters.map(toPublicItem),
    shows: showsWithPosters.map(toPublicItem),
    stats: {
      movies: payload.stats?.movies?.watched ?? movies.length,
      shows: payload.stats?.shows?.watched ?? shows.length,
      episodes: payload.stats?.episodes?.watched ?? 0
    },
    updatedAt: new Date().toISOString()
  };
};

const refreshSnapshot = async (env) => {
  const snapshot = await buildSnapshot(env);
  await putKvJson(env, SNAPSHOT_KEY, snapshot);
  return snapshot;
};

const isStale = (snapshot) => {
  const updatedAt = snapshot?.updatedAt ? new Date(snapshot.updatedAt).getTime() : 0;
  return !updatedAt || Date.now() - updatedAt > SNAPSHOT_MAX_AGE_MS;
};

const handleWatchingRequest = async (request, env, context) => {
  let snapshot = await getKvJson(env, SNAPSHOT_KEY);
  let cacheStatus = snapshot ? 'hit' : 'miss';

  if (!snapshot) {
    try {
      snapshot = await refreshSnapshot(env);
    } catch (error) {
      console.error('Watching refresh failed.', error);
      return jsonResponse(request, env, {
        configured: false,
        error: 'Live Trakt refresh failed.',
        updatedAt: null
      }, 503, { 'x-watching-cache': cacheStatus });
    }
  } else if (isStale(snapshot) && context?.waitUntil) {
    cacheStatus = 'stale';
    context.waitUntil(refreshSnapshot(env).catch((error) => {
      console.error('Background watching refresh failed.', error);
    }));
  }

  return jsonResponse(request, env, snapshot, 200, { 'x-watching-cache': cacheStatus });
};

export default {
  async fetch(request, env, context) {
    const allowedOrigin = getAllowedOrigin(request, env);
    if (allowedOrigin === null) {
      return jsonResponse(request, env, { error: 'Origin not allowed.' }, 403);
    }

    if (request.method === 'OPTIONS') {
      return jsonResponse(request, env, null, 204);
    }

    if (request.method !== 'GET') {
      return jsonResponse(request, env, { error: 'Method not allowed.' }, 405, { allow: 'GET, OPTIONS' });
    }

    const url = new URL(request.url);

    if (url.pathname === '/' || url.pathname === '/health') {
      return jsonResponse(request, env, {
        ok: true,
        service: 'cyberseckyle-watching-api',
        storageConfigured: hasKv(env),
        schedule: '*/30 * * * *'
      });
    }

    if (url.pathname === '/watching') {
      return handleWatchingRequest(request, env, context);
    }

    return jsonResponse(request, env, { error: 'Not found.' }, 404);
  },

  async scheduled(controller, env, context) {
    context.waitUntil(refreshSnapshot(env).catch((error) => {
      console.error(`Scheduled watching refresh failed at ${controller.scheduledTime}.`, error);
      throw error;
    }));
  }
};
