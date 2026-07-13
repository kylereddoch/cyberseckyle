const TRAKT_API_URL = 'https://api.trakt.tv';
const TRAKT_SITE_URL = 'https://trakt.tv';
const TMDB_API_URL = 'https://api.themoviedb.org/3/';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342';

const toArray = value => (Array.isArray(value) ? value : value ? [value] : []);

const sortByWatchedDateDesc = (left, right) => {
  const leftValue = left?.watchedAt ? new Date(left.watchedAt).getTime() : 0;
  const rightValue = right?.watchedAt ? new Date(right.watchedAt).getTime() : 0;
  return rightValue - leftValue;
};

const buildUrl = (baseUrl, path, params = {}) => {
  const url = new URL(path, baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

const getTraktHeaders = ({ clientId, accessToken }) => {
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

const traktRequest = async (path, params, headers) => {
  const url = buildUrl(TRAKT_API_URL, path, params);
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Bad response for ${url} (${response.status}): ${response.statusText}`);
  }

  return response.json();
};

const refreshTraktAccessToken = async ({ clientId, clientSecret, refreshToken }) => {
  if (!clientId || !clientSecret || !refreshToken) return '';

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
    return '';
  }

  const payload = await response.json();
  return payload?.access_token || '';
};

const getTmdbAuth = () => {
  const readAccessToken = process.env.TMDB_READ_ACCESS_TOKEN?.trim();
  const apiKey = process.env.TMDB_API_KEY?.trim();

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
      headers: {
        accept: 'application/json'
      },
      params: { api_key: apiKey }
    };
  }

  return {
    configured: false,
    headers: {},
    params: {}
  };
};

const tmdbPosterCache = new Map();

const getTmdbPoster = async (mediaType, tmdbId, tmdbAuth) => {
  if (!tmdbAuth.configured || !tmdbId) return null;

  const cacheKey = `${mediaType}:${tmdbId}`;
  if (tmdbPosterCache.has(cacheKey)) {
    return tmdbPosterCache.get(cacheKey);
  }

  try {
    const response = await fetch(
      buildUrl(TMDB_API_URL, `${mediaType}/${tmdbId}`, tmdbAuth.params),
      { headers: tmdbAuth.headers }
    );

    if (!response.ok) {
      tmdbPosterCache.set(cacheKey, null);
      return null;
    }

    const payload = await response.json();
    const poster = payload?.poster_path ? `${TMDB_IMAGE_BASE_URL}${payload.poster_path}` : null;
    tmdbPosterCache.set(cacheKey, poster);
    return poster;
  } catch {
    tmdbPosterCache.set(cacheKey, null);
    return null;
  }
};

const getTraktSlug = item => item?.ids?.slug || '';

const mapMovie = async (entry, tmdbAuth) => {
  const movie = entry?.movie || {};
  const slug = getTraktSlug(movie);
  const tmdbId = movie?.ids?.tmdb || null;

  return {
    kind: 'movie',
    label: 'Movie',
    title: movie.title || 'Untitled movie',
    year: movie.year || null,
    watchedAt: entry.watched_at || entry.last_watched_at || null,
    plays: entry.plays || 1,
    url: slug ? `${TRAKT_SITE_URL}/movies/${slug}` : TRAKT_SITE_URL,
    poster: await getTmdbPoster('movie', tmdbId, tmdbAuth)
  };
};

const mapShow = async (entry, tmdbAuth) => {
  const show = entry?.show || {};
  const slug = getTraktSlug(show);
  const tmdbId = show?.ids?.tmdb || null;

  return {
    kind: 'show',
    label: 'TV',
    title: show.title || 'Untitled show',
    year: show.year || null,
    watchedAt: entry.last_watched_at || entry.watched_at || null,
    plays: entry.plays || 1,
    url: slug ? `${TRAKT_SITE_URL}/shows/${slug}` : TRAKT_SITE_URL,
    poster: await getTmdbPoster('tv', tmdbId, tmdbAuth)
  };
};

const mapEpisodeHistory = async (entry, tmdbAuth) => {
  const show = entry?.show || {};
  const episode = entry?.episode || {};
  const slug = getTraktSlug(show);
  const tmdbId = show?.ids?.tmdb || null;
  const season = episode.season ? `S${String(episode.season).padStart(2, '0')}` : '';
  const number = episode.number ? `E${String(episode.number).padStart(2, '0')}` : '';
  const episodePrefix = season || number ? `${season}${number}` : '';

  return {
    kind: 'episode',
    label: 'TV',
    title: show.title || 'Untitled show',
    subtitle: [episodePrefix, episode.title].filter(Boolean).join(': '),
    year: show.year || null,
    watchedAt: entry.watched_at || null,
    url: slug ? `${TRAKT_SITE_URL}/shows/${slug}` : TRAKT_SITE_URL,
    poster: await getTmdbPoster('tv', tmdbId, tmdbAuth)
  };
};

const emptyState = (error = null, username = null) => ({
  configured: false,
  posterConfigured: Boolean(getTmdbAuth().configured),
  error,
  username,
  profileUrl: username ? `${TRAKT_SITE_URL}/users/${username}` : TRAKT_SITE_URL,
  recentActivity: [],
  movies: [],
  shows: [],
  stats: {
    movies: 0,
    shows: 0,
    episodes: 0
  }
});

export default async function () {
  const clientId = process.env.TRAKT_CLIENT_ID?.trim();
  const clientSecret = process.env.TRAKT_CLIENT_SECRET?.trim();
  const configuredAccessToken = process.env.TRAKT_ACCESS_TOKEN?.trim();
  const refreshToken = process.env.TRAKT_REFRESH_TOKEN?.trim();
  const accessToken = configuredAccessToken || await refreshTraktAccessToken({ clientId, clientSecret, refreshToken });
  const username = process.env.TRAKT_USERNAME?.trim();
  const userId = accessToken ? 'me' : username;

  if (!clientId || !userId) {
    return emptyState(null, username);
  }

  const tmdbAuth = getTmdbAuth();
  const headers = getTraktHeaders({ clientId, accessToken });

  try {
    const [
      statsResponse,
      movieHistoryResponse,
      episodeHistoryResponse,
      watchedMoviesResponse,
      watchedShowsResponse
    ] = await Promise.all([
      traktRequest(`/users/${userId}/stats`, {}, headers),
      traktRequest(`/users/${userId}/history/movies`, { limit: 24, extended: 'full' }, headers),
      traktRequest(`/users/${userId}/history/episodes`, { limit: 24, extended: 'full' }, headers),
      traktRequest(`/users/${userId}/watched/movies`, { limit: 24, extended: 'full' }, headers),
      traktRequest(`/users/${userId}/watched/shows`, { limit: 24, extended: 'full' }, headers)
    ]);

    const [recentMovies, recentEpisodes, movies, shows] = await Promise.all([
      Promise.all(toArray(movieHistoryResponse).map(entry => mapMovie(entry, tmdbAuth))),
      Promise.all(toArray(episodeHistoryResponse).map(entry => mapEpisodeHistory(entry, tmdbAuth))),
      Promise.all(toArray(watchedMoviesResponse).map(entry => mapMovie(entry, tmdbAuth))),
      Promise.all(toArray(watchedShowsResponse).map(entry => mapShow(entry, tmdbAuth)))
    ]);

    return {
      configured: true,
      posterConfigured: tmdbAuth.configured,
      error: null,
      username,
      profileUrl: username ? `${TRAKT_SITE_URL}/users/${username}` : TRAKT_SITE_URL,
      recentActivity: [...recentMovies, ...recentEpisodes].sort(sortByWatchedDateDesc).slice(0, 12),
      movies: movies.sort(sortByWatchedDateDesc),
      shows: shows.sort(sortByWatchedDateDesc),
      stats: {
        movies: statsResponse?.movies?.watched || movies.length,
        shows: statsResponse?.shows?.watched || shows.length,
        episodes: statsResponse?.episodes?.watched || 0
      }
    };
  } catch (error) {
    return {
      ...emptyState(error.message, username),
      configured: true
    };
  }
}
