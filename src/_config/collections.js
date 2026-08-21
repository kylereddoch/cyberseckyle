export const getPublishedDate = item => {
  const candidate =
    item?.data?.publishedAt ||
    item?.data?.published_at ||
    item?.data?.actualPublishedAt ||
    item?.data?.actual_published_at ||
    item?.date;
  const date = new Date(candidate);

  return Number.isNaN(date.getTime()) ? item?.date : date;
};

const sortByNewest = (a, b) => getPublishedDate(b) - getPublishedDate(a);
const sortByProjectOrder = (a, b) => {
  const orderA = Number.isFinite(Number(a?.data?.projectOrder)) ? Number(a.data.projectOrder) : Number.MAX_SAFE_INTEGER;
  const orderB = Number.isFinite(Number(b?.data?.projectOrder)) ? Number(b.data.projectOrder) : Number.MAX_SAFE_INTEGER;

  if (orderA !== orderB) {
    return orderA - orderB;
  }

  return String(a?.data?.title || '').localeCompare(String(b?.data?.title || ''));
};

const dedupeByUrl = items => {
  const map = new Map();
  items.forEach(item => {
    if (!item?.url) return;
    map.set(item.url, item);
  });
  return [...map.values()];
};

export const getPosts = collection =>
  collection
    .getFilteredByGlob('./src/posts/**/*.md')
    .filter(item => !item.inputPath.includes('\\weeklynotes\\') && !item.inputPath.includes('/weeklynotes/'))
    .sort(sortByNewest);

export const getBlogEntries = collection =>
  dedupeByUrl([
    ...getPosts(collection),
    ...getNowPosts(collection)
  ]).sort(sortByNewest);


export const getNotes = collection =>
  collection
    .getFilteredByGlob([
      './src/posts/weeklynotes/**/*.md',
      './src/notes/**/*.md'
    ])
    .sort(sortByNewest);

export const getJournalPosts = collection =>
  collection
    .getFilteredByGlob([
      './src/journal/**/*.md',
      './src/posts/journal/**/*.md'
    ])
    .sort(sortByNewest);

export const getProjects = collection =>
  collection
    .getFilteredByGlob('./src/projects/**/*.md')
    .sort(sortByProjectOrder);

export const getNewsletterIssues = collection =>
  collection
    .getFilteredByGlob('./src/newsletter/issues/**/*.md')
    .sort((a, b) => {
      const issueA = Number(a?.data?.issueNumber);
      const issueB = Number(b?.data?.issueNumber);

      if (Number.isFinite(issueA) && Number.isFinite(issueB) && issueA !== issueB) {
        return issueB - issueA;
      }

      return sortByNewest(a, b);
    });

/** Blog + notes + journal + /now, newest first */
export const getAllPosts = collection => {
  return dedupeByUrl([
    ...getBlogEntries(collection),
    ...getNotes(collection),
    ...getJournalPosts(collection)
  ]).sort(sortByNewest);
};

/** All relevant pages as a collection for sitemap.xml */
export const showInSitemap = collection => {
  return collection
    .getFilteredByGlob('./src/**/*.{md,njk}')
    .filter(item => {
      const url = item?.url || '';
      return !url.endsWith('.json') && !url.endsWith('.xml');
    });
};

/** All tags from all post-like content, excluding internal collection tags */
export const tagList = collection => {
  const tagsSet = new Set();
  const ignored = new Set(['all', 'docs', 'posts', 'journal', 'allPosts', 'tagList', 'tags']);

  getAllPosts(collection).forEach(item => {
    if (!Array.isArray(item.data?.tags)) return;
    item.data.tags
      .filter(tag => !ignored.has(tag))
      .forEach(tag => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort((a, b) => String(a).localeCompare(String(b)));
};

export const categoryList = collection => {
  const categories = new Set();

  getPosts(collection).forEach(item => {
    if (item.data?.category) categories.add(item.data.category);
  });

  return Array.from(categories).sort((a, b) => String(a).localeCompare(String(b)));
};

/** All /now updates, newest first */
export const getNowPosts = collection => {
  return collection
    .getFilteredByGlob('./src/now/**/*.md')
    .sort(sortByNewest);
};
