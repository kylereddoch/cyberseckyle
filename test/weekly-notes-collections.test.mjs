import test from 'node:test';
import assert from 'node:assert/strict';
import {getAllPosts, getNotes, getPosts} from '../src/_config/collections.js';

test('dated weekly articles stay in Notes alongside legacy entries without duplicating the combined feed', () => {
  const entry = (inputPath, url, date, tags = []) => ({inputPath, url, date: new Date(date), data: {tags}});
  const article = entry('./src/posts/2026/article.md', '/blog/article/', '2026-11-23');
  const weekly = entry('./src/posts/2026/weekly.md', '/notes/2026/week-48-2026/', '2026-11-25', ['posts', 'weeklynotes']);
  const legacy = entry('./src/posts/weeklynotes/2026/week-46.md', '/notes/2026/week-46-2026/', '2026-11-17');
  const quickNote = entry('./src/notes/2026/note.md', '/notes/note/', '2026-11-24');
  const collection = {
    getFilteredByGlob(glob) {
      if (Array.isArray(glob)) return glob.includes('./src/notes/**/*.md') ? [article, weekly, legacy, quickNote] : [];
      return glob === './src/posts/**/*.md' ? [article, weekly, legacy] : [];
    }
  };

  assert.deepEqual(getPosts(collection), [article]);
  assert.deepEqual(getNotes(collection), [weekly, quickNote, legacy]);
  assert.deepEqual(getAllPosts(collection), [weekly, quickNote, article, legacy]);
});
