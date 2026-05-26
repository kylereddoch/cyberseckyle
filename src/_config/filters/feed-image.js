import Image from '@11ty/eleventy-img';
import {slugifyString} from './slugify.js';

const absoluteUrl = (path, siteUrl) => {
  if (!path) return '';

  try {
    return new URL(path, siteUrl).href;
  } catch {
    return path;
  }
};

const sourceImagePath = imagePath => {
  if (!imagePath || /^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  return imagePath.startsWith('./src') ? imagePath : `./src${imagePath}`;
};

const transformedImageUrl = async imagePath => {
  const metadata = await Image(sourceImagePath(imagePath), {
    formats: ['webp', 'jpeg'],
    widths: ['auto'],
    urlPath: '/img/',
    outputDir: './dist/img/'
  });

  return metadata.jpeg?.[0]?.url || metadata.webp?.[0]?.url || imagePath;
};

export const feedImage = async (post, meta = {}) => {
  const data = post?.data || {};
  const heroImage = data.featuredImage || data.featured_image;
  const defaultImage = meta.opengraph_default || '/assets/images/template/opengraph-default.jpg';
  const defaultAlt = meta.opengraph_default_alt || meta.siteDescription || '';

  if (heroImage) {
    return {
      url: absoluteUrl(await transformedImageUrl(heroImage), meta.url),
      alt: data.featuredImageAlt || data.featured_image_alt || data.alt || data.title || defaultAlt
    };
  }

  if (data.title) {
    return {
      url: absoluteUrl(`/assets/og-images/${data.slug || slugifyString(String(data.title))}-preview.jpeg`, meta.url),
      alt: data.title
    };
  }

  return {
    url: absoluteUrl(defaultImage, meta.url),
    alt: defaultAlt
  };
};
