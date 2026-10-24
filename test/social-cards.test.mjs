import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import nunjucks from 'nunjucks';
import sharp from 'sharp';
import * as meta from '../src/_data/meta.js';
import { slugifyString } from '../src/_config/filters/slugify.js';
import { svgToJpeg } from '../src/_config/events/svg-to-jpeg.js';

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: true });
env.addFilter('slugify', slugifyString);
env.addFilter('metaDescription', value => String(value || ''));
env.addFilter('absoluteUrl', (value, base) => new URL(value, base).href);
env.addFilter('url', value => value);
env.addFilter('toIsoString', value => new Date(value).toISOString());
env.addFilter('json', JSON.stringify);
env.addFilter('merge', (a, b) => ({ ...a, ...b }));

function render(overrides = {}) {
  return env.render('head/meta-info.njk', {
    meta, personal: { platforms: {} }, eleventy: { generator: 'Eleventy' },
    page: { url: '/blog/example/', date: new Date('2026-10-24'), rawInput: 'Example' },
    title: 'A "quoted" title & details', seoTitle: 'A shorter title', slug: 'example',
    description: 'AT&T and a "quoted" description', layout: 'post', ...overrides
  });
}
function value(html, key) {
  const matches = [...html.matchAll(/<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]*)"\s*\/>/g)]
    .filter(match => match[1] === key);
  assert.equal(matches.length, 1, `${key} must occur exactly once`);
  return matches[0][2];
}

for (const layout of ['post', 'note', 'journal']) {
  test(`${layout} requests a large X card with the same image as Open Graph`, () => {
    const html = render({ layout });
    assert.equal(value(html, 'twitter:card'), 'summary_large_image');
    assert.equal(value(html, 'twitter:image'), `${meta.url}/assets/og-images/example-preview.jpeg`);
    assert.equal(value(html, 'twitter:image'), value(html, 'og:image'));
    assert.equal(value(html, 'twitter:image:alt'), value(html, 'og:image:alt'));
    assert.match(value(html, 'twitter:image:alt'), /&quot;quoted&quot;/);
    assert.equal(value(html, 'twitter:title'), 'A shorter title');
    assert.equal(value(html, 'twitter:description'), 'AT&amp;T and a &quot;quoted&quot; description');
    assert.equal(value(html, 'og:image:width'), '1200');
    assert.equal(value(html, 'og:image:height'), '630');
  });
}
test('app/project cards preserve their featured image without invented dimensions', () => {
  for (const layout of ['app', 'project']) {
    const html = render({ layout, featuredImage: '/assets/images/example.png', featuredImageAlt: 'An app screenshot' });
    assert.equal(value(html, 'twitter:image'), `${meta.url}/assets/images/example.png`);
    assert.equal(value(html, 'twitter:image'), value(html, 'og:image'));
    assert.equal(value(html, 'twitter:image:alt'), 'An app screenshot');
    assert.doesNotMatch(html, /property="og:image:(?:width|height|type)"/);
  }
});
test('ordinary pages keep the site fallback and do not emit unconfigured video metadata', () => {
  const html = render({ layout: 'page' });
  assert.equal(value(html, 'twitter:image'), new URL(meta.opengraph_default, meta.url).href);
  assert.doesNotMatch(html, /(?:og:video|twitter:player)/);
});
test('a changed SVG replaces an existing JPEG in the selected build output', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'cyberseckyle-og-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const images = path.join(root, 'assets/og-images');
  await fs.mkdir(images, { recursive: true });
  const svg = color => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="${color}"/></svg>`;
  const source = path.join(images, 'example.svg');
  const jpeg = path.join(images, 'example.jpeg');
  await fs.writeFile(source, svg('#ff0000'));
  await svgToJpeg({ dir: { output: root } });
  const before = await fs.readFile(jpeg);
  await fs.writeFile(source, svg('#0000ff'));
  await svgToJpeg({ dir: { output: root } });
  assert.notDeepEqual(await fs.readFile(jpeg), before);
  const metadata = await sharp(jpeg).metadata();
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
  const { data } = await sharp(jpeg).raw().toBuffer({ resolveWithObject: true });
  assert.ok(data[2] > 240 && data[0] < 10, 'regenerated JPEG must contain the new blue artwork');
});
