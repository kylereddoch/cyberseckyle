import {toISOString, formatDate} from './filters/dates.js';
import {markdownFormat} from './filters/markdown-format.js';
import {shuffleArray} from './filters/sort-random.js';
import {sortAlphabetically} from './filters/sort-alphabetic.js';
import {splitlines} from './filters/splitlines.js';
import {striptags} from './filters/striptags.js';
import {slugifyString} from './filters/slugify.js';
import {metaDescription} from './filters/meta-description.js';
import {featuredImageCaptionHtml} from './filters/featured-image-caption.js';
import {feedImage} from './filters/feed-image.js';
import {cdata} from './filters/cdata.js';

export default {
  toISOString,
  formatDate,
  markdownFormat,
  splitlines,
  striptags,
  metaDescription,
  feedImage,
  cdata,
  shuffleArray,
  sortAlphabetically,
  slugifyString,
  featuredImageCaptionHtml
};
