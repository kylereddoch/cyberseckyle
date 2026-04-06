const HARDCOVER_API_URL = 'https://api.hardcover.app/v1/graphql';

const STATUS_LABELS = {
  1: 'Want to Read',
  2: 'Currently Reading',
  3: 'Read'
};

const toArray = value => (Array.isArray(value) ? value : value ? [value] : []);

const sortByDateDesc = (left, right, key = 'updatedAt') => {
  const leftValue = left?.[key] ? new Date(left[key]).getTime() : 0;
  const rightValue = right?.[key] ? new Date(right[key]).getTime() : 0;
  return rightValue - leftValue;
};

const mapBook = entry => {
  const book = entry?.book || {};
  const slug = book.slug || '';
  const authors = toArray(book.contributions)
    .map(contribution => contribution?.author?.name)
    .filter(Boolean);

  return {
    id: book.id,
    title: book.title || 'Untitled',
    authors,
    image: book?.image?.url || null,
    pages: book.pages || null,
    releaseYear: book.release_year || null,
    statusId: entry.status_id,
    statusLabel: STATUS_LABELS[entry.status_id] || 'Library',
    startedAt: entry.first_started_reading_date || null,
    finishedAt: entry.last_read_date || null,
    updatedAt: entry.updated_at || entry.created_at || entry.date_added || null,
    dateAdded: entry.date_added || null,
    url: slug ? `https://hardcover.app/books/${slug}` : 'https://hardcover.app'
  };
};

const hardcoverRequest = async (query, variables, token) => {
  const response = await fetch(HARDCOVER_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: token,
      'user-agent': 'cyberseckyle-bookshelf/1.0 (+https://www.kylereddoch.me/bookshelf/)'
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    throw new Error(`Bad response for ${HARDCOVER_API_URL} (${response.status}): ${response.statusText}`);
  }

  const payload = await response.json();

  if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
    throw new Error(payload.errors.map(error => error.message).join('; '));
  }

  return payload?.data ?? {};
};

export default async function () {
  const token = process.env.HARDCOVER_TOKEN?.trim();

  if (!token) {
    return {
      configured: false,
      error: null,
      profileUrl: 'https://hardcover.app',
      username: null,
      reading: [],
      finished: [],
      wantToRead: [],
      counts: {
        reading: 0,
        finished: 0,
        wantToRead: 0
      }
    };
  }

  try {
    const viewerData = await hardcoverRequest(
      `
        query BookshelfViewer {
          me {
            id
            username
          }
        }
      `,
      {},
      token
    );

    const viewer = Array.isArray(viewerData?.me) ? viewerData.me[0] : viewerData?.me;
    const userId = viewer?.id;
    const username = viewer?.username || null;

    if (!userId) {
      throw new Error('Hardcover did not return a user id for this token.');
    }

    const booksData = await hardcoverRequest(
      `
        query BookshelfLibrary($userId: Int!) {
          user_books(
            where: {
              user_id: { _eq: $userId }
              status_id: { _in: [1, 2, 3] }
            }
            distinct_on: book_id
            order_by: [{ book_id: asc }, { updated_at: desc }]
            limit: 120
          ) {
            status_id
            created_at
            date_added
            first_started_reading_date
            last_read_date
            updated_at
            book {
              slug
              title
              pages
              release_year
              image {
                url
              }
              contributions {
                author {
                  name
                }
              }
            }
          }
        }
      `,
      { userId },
      token
    );

    const entries = toArray(booksData?.user_books).map(mapBook);

    const reading = entries
      .filter(entry => entry.statusId === 2)
      .sort((left, right) => sortByDateDesc(left, right, 'updatedAt'));
    const finished = entries
      .filter(entry => entry.statusId === 3)
      .sort((left, right) => sortByDateDesc(left, right, 'finishedAt'));
    const wantToRead = entries
      .filter(entry => entry.statusId === 1)
      .sort((left, right) => sortByDateDesc(left, right, 'updatedAt'));

    return {
      configured: true,
      error: null,
      username,
      profileUrl: username ? `https://hardcover.app/@${username}` : 'https://hardcover.app',
      reading,
      finished,
      wantToRead,
      counts: {
        reading: reading.length,
        finished: finished.length,
        wantToRead: wantToRead.length
      }
    };
  } catch (error) {
    return {
      configured: false,
      error: error.message,
      username: null,
      profileUrl: 'https://hardcover.app',
      reading: [],
      finished: [],
      wantToRead: [],
      counts: {
        reading: 0,
        finished: 0,
        wantToRead: 0
      }
    };
  }
}
