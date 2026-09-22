import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import yaml from 'js-yaml';
import {shouldPublishTo} from '../scripts/social-front-matter.mjs';

const workflow = yaml.load(fs.readFileSync(new URL('../.github/workflows/eleventy_build.yml', import.meta.url), 'utf8'));
const steps = workflow.jobs.deploy.steps;
const saveScript = steps.find(step => step.id === 'commit_social').run;
const gitExecPath = spawnSync('git', ['--exec-path'], {encoding: 'utf8'}).stdout.trim();
const bash = process.platform === 'win32' ? path.resolve(gitExecPath, '../../../bin/bash.exe') : 'bash';
const article = 'src/posts/example.md';
const initial = '---\ntitle: Example\nsocial:\n  post_to: [linkedin]\n---\nAn unchanged article.\n';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cyberseckyle-social-test-'));
  const env = {
    ...process.env,
    GIT_CONFIG_GLOBAL: path.join(root, 'empty-gitconfig'),
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_TERMINAL_PROMPT: '0',
    GITHUB_OUTPUT: path.join(root, 'outputs'),
    RUNNER_TEMP: root
  };
  const remote = path.join(root, 'origin.git');
  const author = path.join(root, 'author');
  const runner = path.join(root, 'runner');
  const git = (cwd, ...args) => {
    const result = spawnSync('git', args, {cwd, env, encoding: 'utf8'});
    assert.equal(result.status, 0, `${args.join(' ')}\n${result.stderr}`);
    return result.stdout.trim();
  };
  const write = (cwd, relative, content) => {
    fs.mkdirSync(path.dirname(path.join(cwd, relative)), {recursive: true});
    fs.writeFileSync(path.join(cwd, relative), content);
  };
  git(root, 'init', '--bare', '--initial-branch=main', remote);
  git(root, 'clone', remote, author);
  git(author, 'config', 'user.name', 'Test Author');
  git(author, 'config', 'user.email', 'test@example.invalid');
  write(author, article, initial);
  write(author, 'src/notes/.gitkeep', '');
  write(author, 'src/now/.gitkeep', '');
  git(author, 'add', '.');
  git(author, 'commit', '-m', 'Initial article');
  git(author, 'push', 'origin', 'main');
  git(root, 'clone', remote, runner);
  t.after(() => {
    assert.equal(path.dirname(root), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith('cyberseckyle-social-test-'));
    fs.rmSync(root, {recursive: true, force: true, maxRetries: 3});
  });
  const save = () => spawnSync(bash, ['-c', saveScript], {cwd: runner, env, encoding: 'utf8'});
  const record = id => initial.replace('  post_to: [linkedin]',
    `  post_to: [linkedin]\n  posts: {linkedin: {url: "https://www.linkedin.com/feed/update/urn:li:share:${id}", buffer_id: "buffer-${id}"}}`);
  return {root, env, remote, author, runner, git, write, save, record};
}

test('a queued main run loads the preceding run\'s records and skips LinkedIn', t => {
  const f = fixture(t);
  const eventSha = f.git(f.runner, 'rev-parse', 'HEAD');
  f.write(f.runner, article, f.record('original'));
  const saved = f.save();
  assert.equal(saved.status, 0, saved.stderr);

  // The checkout input must resolve the branch at job start, not the event SHA.
  assert.equal(steps[0].with.ref, "${{ github.ref == 'refs/heads/main' && 'main' || '' }}");
  assert.equal(workflow.jobs.deploy.concurrency['cancel-in-progress'], false);
  const queued = path.join(f.root, 'queued');
  f.git(f.root, 'clone', '--branch', 'main', f.remote, queued);
  assert.notEqual(f.git(queued, 'rev-parse', 'HEAD'), eventSha);
  const raw = fs.readFileSync(path.join(queued, article), 'utf8');
  const data = yaml.load(raw.split('---')[1]);
  assert.equal(shouldPublishTo(data, 'linkedin'), false);
  assert.equal(data.social.posts.linkedin.buffer_id, 'buffer-original');
});

test('social records survive a newer author commit without overwriting it', t => {
  const f = fixture(t);
  f.write(f.runner, article, f.record('original'));
  f.write(f.author, 'README.md', 'New author content\n');
  f.git(f.author, 'add', 'README.md');
  f.git(f.author, 'commit', '-m', 'Concurrent author change');
  f.git(f.author, 'push', 'origin', 'main');
  const saved = f.save();
  assert.equal(saved.status, 0, saved.stderr);
  assert.match(fs.readFileSync(f.env.GITHUB_OUTPUT, 'utf8'), /committed=true/);
  assert.equal(f.git(f.remote, 'show', 'main:README.md'), 'New author content');
  assert.match(f.git(f.remote, 'show', `main:${article}`), /buffer-original/);
});

test('an unchanged posting record creates no additional commit', t => {
  const f = fixture(t);
  const before = f.git(f.remote, 'rev-parse', 'main');
  const saved = f.save();
  assert.equal(saved.status, 0, saved.stderr);
  assert.match(fs.readFileSync(f.env.GITHUB_OUTPUT, 'utf8'), /committed=false/);
  assert.equal(f.git(f.remote, 'rev-parse', 'main'), before);
});

test('a conflicting remote record is preserved and local results remain recoverable', t => {
  const f = fixture(t);
  f.write(f.runner, article, f.record('local'));
  f.write(f.author, article, f.record('remote'));
  f.git(f.author, 'add', article);
  f.git(f.author, 'commit', '-m', 'Existing remote record');
  f.git(f.author, 'push', 'origin', 'main');
  const before = f.git(f.remote, 'rev-parse', 'main');
  const saved = f.save();
  assert.notEqual(saved.status, 0);
  assert.equal(f.git(f.remote, 'rev-parse', 'main'), before);
  assert.match(f.git(f.remote, 'show', `main:${article}`), /buffer-remote/);
  assert.match(fs.readFileSync(path.join(f.root, 'social-post-state.patch'), 'utf8'), /buffer-local/);
  const recovery = steps.find(step => step.name === 'Preserve social post results on save failure');
  assert.match(recovery.if, /steps\.commit_social\.outcome == 'failure'/);
  assert.match(recovery.with.path, /social-post-state\.patch$/);
});

test('rejected Git pushes retry without rerunning publishers and retain a recovery patch', t => {
  const f = fixture(t);
  const before = f.git(f.remote, 'rev-parse', 'main');
  f.write(f.runner, article, f.record('accepted'));
  const hook = path.join(f.remote, 'hooks/pre-receive');
  fs.writeFileSync(hook, '#!/bin/sh\nexit 1\n', {mode: 0o755});
  const saved = f.save();
  assert.notEqual(saved.status, 0);
  assert.equal((saved.stdout.match(/Social metadata push attempt/g) || []).length, 3);
  assert.equal(f.git(f.remote, 'rev-parse', 'main'), before);
  assert.match(fs.readFileSync(path.join(f.root, 'social-post-state.patch'), 'utf8'), /buffer-accepted/);
  assert.doesNotMatch(saveScript, /post-to-(?:buffer|x|mastodon)/);
});
