import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const article = 'src/posts/2026/2026-10-22-client-case-study-tracing-a-suspicious-download-after-quarantine.md';
const source = 'resources/downloads/Trace-Browser-Download.ps1';
const destination = 'assets/downloads/Trace-Browser-Download.ps1';

// Keep the source outside passthrough assets. A draft article does not protect
// ordinary static assets from publication. Only emit this download with its page.
export function articleDownloads(eleventyConfig) {
  eleventyConfig.addWatchTarget(source);

  eleventyConfig.on('eleventy.before', async ({ dir }) => {
    // Also remove a previous local-preview copy when reusing an output directory.
    await fs.rm(path.join(dir.output, destination), { force: true });
  });

  eleventyConfig.on('eleventy.after', async ({ dir, results }) => {
    const renderedArticle = results?.some(result =>
      result.outputPath && result.inputPath && path.resolve(result.inputPath) === path.resolve(article)
    );
    if (!renderedArticle) return;

    const text = await fs.readFile(article, 'utf8');
    const frontMatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!frontMatter) throw new Error('Download article front matter is missing.');
    const metadata = yaml.load(frontMatter[1]);
    const production = process.env.ELEVENTY_ENV === 'production'
      || process.env.NODE_ENV === 'production' || Boolean(process.env.CI);
    // Draft downloads are local preview only, even with BUILD_DRAFTS in CI/prod.
    if (metadata.draft !== false && (production || !process.env.BUILD_DRAFTS)) return;

    const output = path.join(dir.output, destination);
    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.copyFile(source, output);
  });
}
