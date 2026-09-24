import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import Eleventy from '@11ty/eleventy';
import yaml from 'js-yaml';
import {shouldPublishTo} from '../scripts/social-front-matter.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const noteData = JSON.parse(fs.readFileSync(new URL('../src/notes/notes.json', import.meta.url), 'utf8'));

test('shortcut Mastodon links match rendered note URLs, including duplicate titles', async () => {
  const originalCwd = process.cwd();
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'quick-note-mastodon-'));
  const run = (script, args = [], env = {}) => {
    const result = spawnSync(process.execPath, [path.join(root, 'scripts', script), ...args], {
      cwd: temp,
      encoding: 'utf8',
      env: {...process.env, GITHUB_OUTPUT: '', ...env}
    });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout;
  };

  try {
    const body = 'First paragraph.\n\nSecond paragraph with **Markdown**.';
    const files = [];
    for (const encoded of [false, true]) {
      const output = run('create-note.mjs', [], {
        NOTE_TITLE: 'Pumpkin Pie Frappe',
        NOTE_DATE: '2000-09-24T10:24:16-05:00',
        NOTE_DESCRIPTION: '',
        NOTE_SLUG: '',
        NOTE_DRY_RUN: 'false',
        NOTE_BODY: encoded ? '' : body.replaceAll('\n', '\\n'),
        NOTE_BODY_BASE64: encoded ? Buffer.from(body).toString('base64') : ''
      });
      const relative = output.trim().replace('Created ', '');
      files.push(relative);
      const raw = fs.readFileSync(path.join(temp, relative), 'utf8');
      const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
      const data = yaml.load(match[1]);
      assert.equal(raw.slice(match[0].length).trim(), body);
      assert.equal(shouldPublishTo(data, 'mastodon'), true);
      assert.equal(shouldPublishTo(data, 'x'), false);
      assert.equal(shouldPublishTo(data, 'linkedin'), false);
    }

    // Render with the real notes permalink, without unrelated site layout/assets.
    fs.writeFileSync(path.join(temp, 'src/notes/notes.json'), JSON.stringify({permalink: noteData.permalink}));
    const configPath = path.join(temp, 'eleventy.config.mjs');
    fs.writeFileSync(configPath, 'export default function () { return {}; }');
    process.chdir(temp);
    const eleventy = new Eleventy('./src', './dist', {configPath});
    eleventy.setIsVerbose(false);
    const pages = await eleventy.toJSON();
    assert.equal(pages.length, 2);
    for (const relative of files) {
      const page = pages.find(page => path.resolve(page.inputPath) === path.resolve(temp, relative));
      assert.ok(page, `Missing rendered note: ${relative}`);
      assert.match(page.url, /^\/notes\/pumpkin-pie-frappe(?:-2)?\/$/);
      const preview = run('post-to-mastodon.mjs', ['--dry-run', relative], {
        MASTODON_SITE_URL: 'https://www.kylereddoch.me'
      });
      assert.ok(preview.includes(`New note from me: Pumpkin Pie Frappe\n\nhttps://www.kylereddoch.me${page.url}`));
    }
  } finally {
    process.chdir(originalCwd);
    assert.equal(path.dirname(temp), path.resolve(os.tmpdir()));
    assert.ok(path.basename(temp).startsWith('quick-note-mastodon-'));
    fs.rmSync(temp, {recursive: true, force: true});
  }
});
