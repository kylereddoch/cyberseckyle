import test from 'node:test';
import assert from 'node:assert/strict';
import { articleHeadings } from '../src/_config/filters/article-headings.js';
import { articleCallout, articleDetails, articleSteps } from '../src/_config/shortcodes/article-components.js';
import { markdownLib } from '../src/_config/plugins/markdown.js';

test('contents links match rendered Markdown IDs, including duplicates and explicit anchors', () => {
  const html = markdownLib.render('## A & B\n\n## A & B\n\n## Custom {#custom-id}\n\n### Nested\n');
  const headings = articleHeadings(html);
  assert.equal(headings.length, 3);
  assert.equal(headings[0].text, 'A & B');
  assert.notEqual(headings[0].id, headings[1].id);
  assert.equal(headings[2].id, 'custom-id');
  for (const heading of headings) assert.ok(html.includes(`id="${heading.id}"`));
});

test('contents handle formatting and entities without copying active HTML', () => {
  assert.deepEqual(articleHeadings('<h2 id="a b">Use <code>&lt;details&gt;</code> &amp; <em>examples</em></h2><h2>No ID</h2><h2 id="a b">Duplicate</h2>'), [
    { id: 'a b', href: '#a%20b', text: 'Use <details> & examples' }
  ]);
  assert.deepEqual(articleHeadings(null), []);
});

test('article components render Markdown, native disclosure, and escaped labels', () => {
  const callout = articleCallout('Useful **detail**.', 'A < B', 'invalid');
  assert.match(callout, /article-callout--note/);
  assert.match(callout, /A &lt; B/);
  assert.match(callout, /<strong>detail<\/strong>/);
  assert.match(articleDetails('More context.', 'A & B'), /<summary>A &amp; B<\/summary>/);
  assert.match(articleSteps('Example', [{title: '<script>', text: 'A & B'}]), /&lt;script&gt;/);
});

test('contents do not send readers to headings inside a collapsed example', () => {
  assert.deepEqual(articleHeadings('<details><summary>Example</summary><h2 id="hidden">Hidden</h2></details><h2 id="main">Main section</h2>'), [
    {id: 'main', href: '#main', text: 'Main section'}
  ]);
});
