import {Buffer} from 'node:buffer';
import minifyHtml from '@minify-html/node';

const isProduction = process.env.ELEVENTY_ENV === 'production';

export const htmlConfig = (eleventyConfig) => {
  eleventyConfig.addTransform('html-minify', function (content, outputPath) {
    // Only run for built HTML in production
    if (!isProduction || !outputPath || !outputPath.endsWith('.html')) return content;

    // Optional: allow per-page opt-out with `no_minify: true` in front matter
    const page = this.page || {};
    if (page.data && page.data.no_minify) return content;

    try {
      return minifyHtml.minify(Buffer.from(content), {
        // Preserve the current document structure and avoid changing inline JS.
        keep_closing_tags: true,
        keep_html_and_head_opening_tags: true,
        minify_css: true,
        minify_js: false,
        preserve_brace_template_syntax: true
      }).toString();
    } catch (err) {
      console.warn(`[html-minify] skipped ${outputPath}: ${err?.message || err}`);
      return content; // don’t fail the build
    }
  });
};
