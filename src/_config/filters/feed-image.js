import {slugifyString} from './slugify.js';

const absoluteUrl = (path, siteUrl) => {
  if (!path) return '';

  try {
    return new URL(path, siteUrl).href;
  } catch {
    return path;
  }
};

export const feedImage = (post, meta = {}) => {
  const data = post?.data || {};
  const heroImage = data.featuredImage || data.featured_image;
  const defaultImage = meta.opengraph_default || '/assets/images/template/opengraph-default.jpg';
  const defaultAlt = meta.opengraph_default_alt || meta.siteDescription || '';

  if (heroImage) {
    return {
      url: absoluteUrl(heroImage, meta.url),
      alt: data.featuredImageAlt || data.featured_image_alt || data.alt || data.title || defaultAlt
    };
  }

  if (data.title) {
    return {
      url: absoluteUrl(`/assets/og-images/${slugifyString(String(data.title))}-preview.jpeg`, meta.url),
      alt: data.title
    };
  }

  return {
    url: absoluteUrl(defaultImage, meta.url),
    alt: defaultAlt
  };
};
