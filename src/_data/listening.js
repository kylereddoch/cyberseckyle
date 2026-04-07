import EleventyFetch from '@11ty/eleventy-fetch';

const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';

const toArray = value => (Array.isArray(value) ? value : value ? [value] : []);

const buildUrl = params => {
  const url = new URL(LASTFM_API_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

const pickImage = images => {
  const ordered = ['extralarge', 'large', 'medium', 'small'];
  for (const size of ordered) {
    const match = toArray(images).find(image => image?.size === size && image['#text']);
    if (match) return match['#text'];
  }
  return '';
};

export default async function () {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) {
    return {
      configured: false,
      error: null,
      clientApiKey: null,
      username: username || null,
      profileUrl: username ? `https://www.last.fm/user/${username}` : 'https://www.last.fm',
      nowPlaying: null,
      recentTracks: [],
      topArtists: [],
      topAlbums: []
    };
  }

  try {
    const [recentResponse, artistsResponse, albumsResponse] = await Promise.all([
      EleventyFetch(
        buildUrl({
          method: 'user.getrecenttracks',
          user: username,
          api_key: apiKey,
          limit: 12,
          format: 'json'
        }),
        { duration: '1h', type: 'json' }
      ),
      EleventyFetch(
        buildUrl({
          method: 'user.gettopartists',
          user: username,
          api_key: apiKey,
          period: '1month',
          limit: 6,
          format: 'json'
        }),
        { duration: '6h', type: 'json' }
      ),
      EleventyFetch(
        buildUrl({
          method: 'user.gettopalbums',
          user: username,
          api_key: apiKey,
          period: '1month',
          limit: 6,
          format: 'json'
        }),
        { duration: '6h', type: 'json' }
      )
    ]);

    if (recentResponse?.error) throw new Error(recentResponse.message || 'Last.fm recent tracks request failed.');
    if (artistsResponse?.error) throw new Error(artistsResponse.message || 'Last.fm top artists request failed.');
    if (albumsResponse?.error) throw new Error(albumsResponse.message || 'Last.fm top albums request failed.');

    const recentTracks = toArray(recentResponse?.recenttracks?.track).map(track => ({
      name: track?.name || 'Unknown track',
      artist: track?.artist?.['#text'] || 'Unknown artist',
      album: track?.album?.['#text'] || '',
      image: pickImage(track?.image),
      url: track?.url || null,
      nowPlaying: track?.['@attr']?.nowplaying === 'true',
      listenedAt: track?.date?.['#text'] || null,
      listenedAtUnix: track?.date?.uts || null
    }));

    const nowPlaying = recentTracks.find(track => track.nowPlaying) || null;
    const topArtists = toArray(artistsResponse?.topartists?.artist).map(artist => ({
      name: artist?.name || 'Unknown artist',
      playcount: artist?.playcount || '0',
      image: pickImage(artist?.image),
      url: artist?.url || null
    }));
    const topAlbums = toArray(albumsResponse?.topalbums?.album).map(album => ({
      name: album?.name || 'Unknown album',
      artist: album?.artist?.name || album?.artist || 'Unknown artist',
      playcount: album?.playcount || '0',
      image: pickImage(album?.image),
      url: album?.url || null
    }));

    return {
      configured: true,
      error: null,
      clientApiKey: apiKey,
      username,
      profileUrl: `https://www.last.fm/user/${username}`,
      nowPlaying,
      recentTracks,
      topArtists,
      topAlbums
    };
  } catch (error) {
    return {
      configured: true,
      error: error.message,
      clientApiKey: apiKey,
      username,
      profileUrl: `https://www.last.fm/user/${username}`,
      nowPlaying: null,
      recentTracks: [],
      topArtists: [],
      topAlbums: []
    };
  }
}
