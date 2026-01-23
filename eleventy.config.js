/**
 * Most adjustments must be made in `./src/_config/*`
 *
 * Hint VS Code for eleventyConfig autocompletion.
 * © Henry Desroches - https://gist.github.com/xdesro/69583b25d281d055cd12b144381123bf
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig -
 * @returns {Object} -
 */

// register dotenv for process.env.* variables to pickup
import dotenv from 'dotenv';
dotenv.config();

// add yaml support
import yaml from 'js-yaml';

//  config import
import { getAllPosts, showInSitemap, tagList, getNowPosts } from './src/_config/collections.js';
import events from './src/_config/events.js';
import filters from './src/_config/filters.js';
import dateFilters from './src/_config/filters/oldpost.js';
import plugins from './src/_config/plugins.js';
import shortcodes from './src/_config/shortcodes.js';
import { buildAllCss } from './src/_config/plugins/css-config.js';
import { buildAllJs } from './src/_config/plugins/js-config.js';

// reading time plugin
import readingTime from 'eleventy-plugin-reading-time';


// Mastodon Direct-Embed: bleed-friendly, auto-height reliable
async function mastodonEmbedShortcode(statusUrl, maxWidth = 720, layout = 'normal') {
  try {
    const u = new URL(String(statusUrl));
    const embedSrc = `${u.origin}${u.pathname}/embed`;
    const scriptSrc = `${u.origin}/embed.js`;
    const w = Math.max(1, Number(maxWidth) || 720);
    const bleed = String(layout).toLowerCase() === 'bleed';

    // Wrapper:
    // - normal: constrained box centered in prose column
    // - bleed: full viewport width, center child, but clamp child width to your cap
    const wrapperStyle = bleed
      ? `style="width:100vw; position:relative; left:50%; right:50%; margin-left:-50vw; margin-right:-50vw; display:grid; place-items:center;"`
      : `style="max-width:${w}px; margin:0 auto;"`;

    // Iframe:
    // - no fixed height; min-height avoids FOUC before resize
    // - in bleed, clamp width with min(100vw, cap)
    const iframeStyle = bleed
      ? `style="width:min(100vw, ${w}px); border:0; display:block; overflow:hidden; min-height:300px;"`
      : `style="width:100%; border:0; display:block; overflow:hidden; min-height:300px;"`;

    // Important: load embed.js first (non-async), then render iframe
    // Also avoid duplicate loads by guarding with an ID per origin.
    const loaderId = `masto-embed-loader-${u.origin.replace(/[^a-z0-9]/gi, '')}`;
    const loader = `
<script>
  (function(id, src){
    if (!document.getElementById(id)) {
      var s = document.createElement('script');
      s.id = id; s.src = '${scriptSrc}';
      document.head.appendChild(s);
    }
  })('${loaderId}', '${scriptSrc}');
</script>`.trim();

    return `
${loader}
<div class="mastodon-embed-wrapper" ${wrapperStyle}>
  <iframe
    class="mastodon-embed"
    src="${embedSrc}"
    ${iframeStyle}
    sandbox="allow-scripts allow-same-origin allow-popups"
    allow="fullscreen"
    loading="lazy"
  ></iframe>
</div>`.trim();

  } catch {
    return `<p><a href="${statusUrl}">${statusUrl}</a></p>`;
  }
}


export default async function (eleventyConfig) {

  eleventyConfig.on('eleventy.before', async () => {
    await buildAllCss();
    await buildAllJs();
  });

  eleventyConfig.addWatchTarget('./src/assets/**/*.{css,js,svg,png,jpeg,gif}');
  eleventyConfig.addWatchTarget('./src/_includes/**/*.{webc}');

  // --------------------- layout aliases
  eleventyConfig.addLayoutAlias('base', 'base.njk');
  eleventyConfig.addLayoutAlias('page', 'page.njk');
  eleventyConfig.addLayoutAlias('post', 'post.njk');
  eleventyConfig.addLayoutAlias('tags', 'tags.njk');

  // ---------------------
  // Tag pagination helpers (NEW)
  // ---------------------
  const chunk = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  };

  // Use your existing slugify filter if available, but we can’t call Nunjucks filters here.
  // So we use a safe internal slugify that matches typical Eleventy behavior.
  const slugifyLocal = (str) =>
    String(str)
      .normalize("NFKD")
      .toLowerCase()
      .trim()
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  //	---------------------  Collections
  eleventyConfig.addCollection('allPosts', getAllPosts);
  eleventyConfig.addCollection('showInSitemap', showInSitemap);
  eleventyConfig.addCollection('tagList', tagList);

  // ✅ new now collection
  eleventyConfig.addCollection('nowEntries', getNowPosts);

  // ✅ NEW: paginated “virtual pages” for each tag
  // This powers /tags/<tag>/, /tags/<tag>/1/, /tags/<tag>/2/ ... etc
  eleventyConfig.addCollection('tagPages', function (collectionApi) {
    const postsPerPage = 8; // <- change this to your preferred page size

    // Best effort to align with your existing tagList exclusions
    const excluded = new Set(["all", "nav", "post", "posts", "tagList", "tags"]);

    // Build tag list from all content
    const tagSet = new Set();
    for (const item of collectionApi.getAll()) {
      const tags = item?.data?.tags;
      if (!tags) continue;
      for (const t of tags) {
        if (!t || excluded.has(t)) continue;
        tagSet.add(t);
      }
    }

    const tags = [...tagSet].sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base" })
    );

    const pages = [];

    for (const tag of tags) {
      const slug = slugifyLocal(tag);

      // Pull posts for this tag, newest first
      const allItems = collectionApi.getFilteredByTag(tag).reverse();

      const totalItems = allItems.length;
      const chunks = chunk(allItems, postsPerPage);
      const pageCount = chunks.length;

      // URL scheme:
      // page 1: /tags/<slug>/
      // page 2: /tags/<slug>/1/
      // page 3: /tags/<slug>/2/
      const hrefs = chunks.map((_, i) =>
        i === 0 ? `/tags/${slug}/` : `/tags/${slug}/${i}/`
      );

      const pageNums = hrefs.map((_, i) => i);

      chunks.forEach((items, i) => {
        pages.push({
          tag,
          slug,
          items,        // posts for THIS page
          allItems,     // all posts for the tag
          totalItems,
          size: postsPerPage,
          pageNumber: i,
          pageCount,
          permalink: hrefs[i],

          // This is shaped like Eleventy’s pagination object
          pager: {
            size: postsPerPage,
            pages: pageNums,
            hrefs,
            href: {
              previous: i > 0 ? hrefs[i - 1] : null,
              next: i < hrefs.length - 1 ? hrefs[i + 1] : null,
            },
          },
        });
      });
    }

    return pages;
  });


  // ---------------------  Plugins
  eleventyConfig.addPlugin(plugins.htmlConfig);
  eleventyConfig.addPlugin(plugins.drafts);

  eleventyConfig.addPlugin(plugins.EleventyRenderPlugin);
  eleventyConfig.addPlugin(plugins.rss);
  eleventyConfig.addPlugin(plugins.syntaxHighlight);


  eleventyConfig.addPlugin(plugins.webc, {
    components: ['./src/_includes/webc/**/*.webc'],
    useTransform: true
  });

  eleventyConfig.addPlugin(plugins.eleventyImageTransformPlugin, {
    formats: ['webp', 'jpeg'],
    widths: ['auto'],
    htmlOptions: {
      imgAttributes: {
        loading: 'lazy',
        decoding: 'async',
        sizes: 'auto'
      },
      pictureAttributes: {}
    }
  });

  // reading time plugin (provides a tag)
  eleventyConfig.addPlugin(readingTime);

  // "readTime" filter usable as {{ content | readTime }}
  eleventyConfig.addFilter('readTime', (html, opts = {}) => {
    const wpm = opts.wpm || 225;
    const text = String(html || '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const words = text ? text.split(' ').length : 0;
    const minutes = Math.max(1, Math.round(words / wpm));
    return `${minutes} min read`;
  });

  // date filters
  Object.keys(dateFilters).forEach(filterName => {
    eleventyConfig.addFilter(filterName, dateFilters[filterName])
  })

  // ---------------------  bundle
  eleventyConfig.addBundle('css', { hoist: true });

  // 	--------------------- Library and Data
  eleventyConfig.setLibrary('md', plugins.markdownLib);
  eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents));

  // --------------------- Filters
  eleventyConfig.addFilter('toIsoString', filters.toISOString);
  eleventyConfig.addFilter('formatDate', filters.formatDate);
  eleventyConfig.addFilter('markdownFormat', filters.markdownFormat);
  eleventyConfig.addFilter('splitlines', filters.splitlines);
  eleventyConfig.addFilter('striptags', filters.striptags);
  eleventyConfig.addFilter('shuffle', filters.shuffleArray);
  eleventyConfig.addFilter('alphabetic', filters.sortAlphabetically);
  eleventyConfig.addFilter('slugify', filters.slugifyString);

  // Build a Mastodon /share URL
  eleventyConfig.addFilter("mastoShareUrl", (instance, url, text, title, hashtags = []) => {
    try {
      const u = new URL(`https://${instance}/share`);
      if (text) u.searchParams.set("text", text);
      if (url) u.searchParams.set("url", url);
      if (title && !text) u.searchParams.set("title", title);
      if (Array.isArray(hashtags) && hashtags.length) {
        u.searchParams.set("hashtags", hashtags.join(","));
      }
      return u.toString();
    } catch {
      return "#";
    }
  });

  eleventyConfig.addFilter('split', (str, sep) => String(str).split(sep));

  // --------------------- Shortcodes
  eleventyConfig.addShortcode('svg', shortcodes.svgShortcode);
  eleventyConfig.addShortcode('image', shortcodes.imageShortcode);
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  eleventyConfig.addShortcode("affiliateNote", () =>
    '>**Affiliate disclosure**: This article contains affiliate links. If you choose to purchase through these links, I may receive a commission. This helps support my work and does not affect the price you pay. I only recommend products I use and trust. My views are my own.'
  );

  eleventyConfig.addShortcode("affiliateLinks", () =>
    '>**Affiliate disclosure**: Some links many contain affiliate links for products and apps that I use and love. If you choose to purchase through these links, I may receive a commission. This helps support my work and does not affect the price you pay. I only recommend products I use and trust.'
  );

  // ✅ Mastodon direct-embed shortcode registrations
  eleventyConfig.addNunjucksAsyncShortcode('mastodon', mastodonEmbedShortcode);
  eleventyConfig.addLiquidShortcode('mastodon', (url, w, h) => mastodonEmbedShortcode(url, w, h));
  eleventyConfig.addJavaScriptFunction('mastodon', mastodonEmbedShortcode);

  // --------------------- Events ---------------------
  if (process.env.ELEVENTY_RUN_MODE === 'serve') {
    eleventyConfig.on('eleventy.after', events.svgToJpeg);
  }

  // --------------------- Passthrough File Copy
  ['src/assets/fonts/', 'src/assets/images/template', 'src/assets/og-images'].forEach(path =>
    eleventyConfig.addPassthroughCopy(path)
  );

  eleventyConfig.addPassthroughCopy({
    // -- to root
    'src/assets/images/favicon/*': '/',
    // -- node_modules
    'node_modules/lite-youtube-embed/src/lite-yt-embed.{css,js}': `assets/components/`
  });

  eleventyConfig.addPassthroughCopy({
    "node_modules/@daviddarnes/mastodon-post/mastodon-post.js": "assets/js/mastodon-post.js",
  });

  eleventyConfig.addPassthroughCopy({ "src/assets/svg": "assets/svg" });

  eleventyConfig.addPassthroughCopy({
    "node_modules/@zachleat/snow-fall/snow-fall.js":
      "assets/scripts/components/snow-fall.js",
  });

  eleventyConfig.addPassthroughCopy({
    "src/assets/images/buttons": "assets/images/buttons"
  });


  // --------------------- general config
  return {
    markdownTemplateEngine: 'njk',

    dir: {
      output: 'dist',
      input: 'src',
      includes: '_includes',
      layouts: '_layouts'
    }
  };
}
