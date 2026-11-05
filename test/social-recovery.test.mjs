import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {checkArchive, checkSocialRecovery, validatePatch} from '../scripts/check-social-recovery.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'social-recovery-test-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const git = (...args) => execFileSync('git', args, {cwd: root, encoding: 'utf8'});
  git('init', '-q');
  fs.mkdirSync(path.join(root, 'src/posts'), {recursive: true});
  const file = path.join(root, 'src/posts/example.md');
  const before = '---\ntitle: Example\nsocial:\n  post_to: [x]\n---\nBody\n';
  const after = before.replace('  post_to: [x]', '  post_to: [x]\n  posts: {x: {url: "https://example.test/post/1", buffer_id: "accepted-1"}}');
  fs.writeFileSync(file, before);
  git('add', '.');
  fs.writeFileSync(file, after);
  const patch = git('diff', '--binary');
  const zip = (content = patch, entry = 'social-post-state.patch') => {
    const source = path.join(root, entry);
    fs.writeFileSync(source, content);
    const archive = path.join(root, `archive-${Math.random()}.zip`);
    execFileSync('zip', ['-q', archive, entry], {cwd: root});
    return fs.readFileSync(archive);
  };
  return {root, file, before, after, patch, zip};
}

const artifact = {id: 13462212795, name: 'social-post-state-123-1', expired: false, workflow_run: {head_branch: 'main'}};
const json = artifacts => new Response(JSON.stringify({artifacts}), {status: 200});
const options = f => ({repository: 'owner/repo', token: 'test-token', cwd: f.root, log: () => {}});

test('restored patch passes without changing files; missing records fail closed', t => {
  const f = fixture(t);
  const archive = f.zip();
  checkArchive(archive, {cwd: f.root});
  assert.equal(fs.readFileSync(f.file, 'utf8'), f.after);
  fs.writeFileSync(f.file, f.before);
  assert.throws(() => checkArchive(archive, {cwd: f.root}), /not fully restored/);
  assert.equal(fs.readFileSync(f.file, 'utf8'), f.before);
});

test('missing patch, invalid zip, paths, modes, and binary patches fail closed', t => {
  const f = fixture(t);
  assert.throws(() => checkArchive(f.zip('', 'other.txt'), {cwd: f.root}), /must contain only/);
  assert.throws(() => checkArchive(Buffer.from('not a zip'), {cwd: f.root}));
  assert.throws(() => checkArchive(f.zip(''), {cwd: f.root}), /Missing/);
  for (const replacement of ['README.md', 'src/posts/../../outside.md', 'src/posts//file.md']) {
    assert.throws(() => validatePatch(f.patch.replaceAll('src/posts/example.md', replacement)), /path/);
  }
  assert.throws(() => validatePatch(f.patch.replace('100644', '120000')), /regular Markdown/);
  assert.throws(() => validatePatch('diff --git a/src/posts/a.md b/src/posts/a.md\nGIT binary patch\n'), /regular Markdown/);
});

test('paginates all artifacts and checks a restored recovery on page two', async t => {
  const f = fixture(t);
  const calls = [];
  const count = await checkSocialRecovery({...options(f), fetchImpl: async (url, init) => {
    calls.push(url);
    assert.match(init.headers.Authorization, /Bearer test-token/);
    if (url.endsWith('page=1')) return json(Array.from({length: 100}, () => ({name: 'unrelated'})));
    if (url.endsWith('page=2')) return json([artifact]);
    assert.ok(url.endsWith('/13462212795/zip'));
    return new Response(f.zip());
  }});
  assert.equal(count, 1);
  assert.equal(calls.length, 3);
});

test('signed download redirect does not receive the GitHub token', async t => {
  const f = fixture(t);
  await checkSocialRecovery({...options(f), fetchImpl: async (url, init) => {
    if (url.includes('page=')) return json([artifact]);
    if (url.endsWith('/zip')) return new Response(null, {status: 302, headers: {location: 'https://storage.example.test/archive'}});
    assert.equal(init.headers, undefined);
    assert.equal(init.redirect, 'error');
    return new Response(f.zip());
  }});
});

test('API failures, expired artifacts, unknown branch and missing download block publishing', async t => {
  const f = fixture(t);
  for (const fetchImpl of [
    async () => new Response('', {status: 403}),
    async () => {throw new Error('Network unavailable');},
    async () => new Response('{}'),
    async () => json([{...artifact, expired: true}]),
    async () => json([{...artifact, workflow_run: null}]),
    async url => url.includes('page=') ? json([artifact]) : new Response('', {status: 404})
  ]) {
    await assert.rejects(checkSocialRecovery({...options(f), fetchImpl}));
  }
});

test('ignores other branches but checks all matching main artifacts', async t => {
  const f = fixture(t);
  let downloads = 0;
  await checkSocialRecovery({...options(f), fetchImpl: async url => {
    if (url.includes('page=')) return json([{...artifact, workflow_run: {head_branch: 'feature'}}, artifact]);
    downloads++;
    return new Response(f.zip());
  }});
  assert.equal(downloads, 1);
});

test('later YAML formatting, additional platforms, and adjacent edits preserve accepted records', t => {
  const f = fixture(t);
  const archive = f.zip();
  const current = `---
title: Revised example
social:
  post_to: [x, mastodon]
  posts:
    x:
      buffer_id: accepted-1
      url: https://example.test/post/1
    mastodon:
      url: https://example.test/post/2
---
Revised body, unrelated to the recorded social result.
`;
  fs.writeFileSync(f.file, current);
  checkArchive(archive, {cwd: f.root});
  assert.equal(fs.readFileSync(f.file, 'utf8'), current);
});

test('semantic verification rejects removed or changed accepted IDs and URLs', t => {
  const f = fixture(t);
  const archive = f.zip();
  for (const current of [
    f.after.replace('accepted-1', 'accepted-2'),
    f.after.replace(', buffer_id: "accepted-1"', ''),
    f.after.replace('https://example.test/post/1', 'https://example.test/post/other'),
    f.before
  ]) {
    fs.writeFileSync(f.file, current);
    assert.throws(() => checkArchive(archive, {cwd: f.root}), /not fully restored/);
  }
});

test('semantic recovery requires the original blob and verified reconstructed identity', t => {
  const f = fixture(t);
  fs.writeFileSync(f.file, f.after.replace('title: Example', 'title: Edited'));
  const missingOriginal = f.patch.replace(/index [a-f0-9]+\.\./, 'index 000000000..');
  assert.throws(() => checkArchive(f.zip(missingOriginal), {cwd: f.root}), /not fully restored/);
  const wrongExpected = f.patch.replace(/\.\.[a-f0-9]+ 100644/, '..000000000 100644');
  assert.throws(() => checkArchive(f.zip(wrongExpected), {cwd: f.root}), /identity mismatch/);
});

test('fallback rejects artifact changes outside social records and preserves publication time', t => {
  const f = fixture(t);
  const git = (...args) => execFileSync('git', args, {cwd: f.root, encoding: 'utf8'});
  fs.writeFileSync(f.file, f.after.replace('title: Example', 'title: Changed in artifact'));
  const unrelated = git('diff', '--binary');
  fs.writeFileSync(f.file, f.after.replace('title: Example', 'title: Changed again'));
  assert.throws(() => checkArchive(f.zip(unrelated), {cwd: f.root}), /changes more than/);

  const published = f.after.replace('---\nBody', 'publishedAt: "2026-11-05T23:21:08.242Z"\n---\nBody');
  fs.writeFileSync(f.file, published);
  const archive = f.zip(git('diff', '--binary'));
  fs.writeFileSync(f.file, published.replace('title: Example', 'title: Edited').replace('"2026-11-05T23:21:08.242Z"', '2026-11-05T23:21:08.242Z'));
  checkArchive(archive, {cwd: f.root});
  fs.writeFileSync(f.file, f.after.replace('title: Example', 'title: Edited'));
  assert.throws(() => checkArchive(archive, {cwd: f.root}), /publication time/);
});
