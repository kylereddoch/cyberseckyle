// Read-only publishing gate. Never applies patches or changes external state.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {isDeepStrictEqual} from 'node:util';
import yaml from 'js-yaml';

const limit = 10 * 1024 * 1024;
const patchName = 'social-post-state.patch';

export function validatePatch(patch) {
  if (!patch || Buffer.byteLength(patch) > limit || patch.includes('\0')) {
    throw new Error('Missing, oversized, or binary recovery patch');
  }
  const sections = patch.split(/(?=^diff --git )/m);
  for (const section of sections) {
    const lines = section.split('\n');
    const header = /^diff --git a\/(src\/(?:posts|notes|now)\/[A-Za-z0-9_./-]+\.md) b\/\1$/.exec(lines[0]);
    if (!header || header[1].split('/').some(part => !part || part === '.' || part === '..')) {
      throw new Error('Unsupported recovery patch path or format');
    }
    let i = 1;
    if (/^index [a-f0-9]+\.\.[a-f0-9]+(?: 100644)?$/.test(lines[i])) i++;
    if (lines[i++] !== `--- a/${header[1]}` || lines[i++] !== `+++ b/${header[1]}` ||
        !/^@@ -\d+(?:,\d+)? \+\d+(?:,\d+)? @@/.test(lines[i])) {
      throw new Error('Only existing regular Markdown file text patches are supported');
    }
    // Git parses the hunk bodies; reject extended/binary patch metadata explicitly.
    if (/^(?:GIT binary patch|Binary files |old mode |new mode |rename |copy |new file mode |deleted file mode )/m.test(section)) {
      throw new Error('Unsupported recovery patch metadata');
    }
  }
}

// Reconstruct each complete expected file from Git's original blob, not from
// hunk fragments interpreted as YAML. Verify the resulting Git blob identity.
function reconstruct(section, cwd) {
  const lines = section.split('\n');
  const relative = /^diff --git a\/(.*?) b\//.exec(lines[0])[1];
  const hashes = /^index ([a-f0-9]{7,40})\.\.([a-f0-9]{7,40}) 100644$/.exec(lines[1]);
  if (!hashes) throw new Error('Recovery patch lacks reconstructable blob identities');
  const original = execFileSync('git', ['cat-file', 'blob', hashes[1]], {
    cwd, encoding: 'utf8', maxBuffer: limit, stdio: ['pipe', 'pipe', 'pipe']
  });
  const source = original.match(/[^\n]*\n|[^\n]+$/g) || [];
  const output = [];
  let cursor = 0;
  let i = 4;
  while (i < lines.length && lines[i]) {
    const hunk = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(?:.*)$/.exec(lines[i++]);
    if (!hunk) throw new Error('Invalid recovery hunk');
    const oldCount = Number(hunk[2] ?? 1);
    const newCount = Number(hunk[4] ?? 1);
    const start = Number(hunk[1]) - (oldCount ? 1 : 0);
    const target = Number(hunk[3]) - (newCount ? 1 : 0);
    if (start < cursor || start > source.length) throw new Error('Invalid recovery hunk position');
    output.push(...source.slice(cursor, start));
    cursor = start;
    if (output.length !== target) throw new Error('Invalid recovery output position');
    let removed = 0;
    let added = 0;
    while (i < lines.length && !lines[i].startsWith('@@ ') && lines[i] !== '') {
      const line = lines[i++];
      if (![' ', '-', '+'].includes(line[0])) throw new Error('Invalid recovery hunk content');
      let value = line.slice(1) + '\n';
      if (lines[i] === '\\ No newline at end of file') {
        value = value.slice(0, -1);
        i++;
      }
      if (line[0] !== '+') {
        if (source[cursor++] !== value) throw new Error('Recovery hunk does not match original blob');
        removed++;
      }
      if (line[0] !== '-') { output.push(value); added++; }
    }
    if (removed !== oldCount || added !== newCount) throw new Error('Recovery hunk length mismatch');
  }
  if (lines.slice(i).some(line => line !== '')) throw new Error('Unexpected recovery patch suffix');
  const expected = output.concat(source.slice(cursor)).join('');
  const hash = execFileSync('git', ['hash-object', '--stdin'], {cwd, input: expected, encoding: 'utf8'}).trim();
  if (!hash.startsWith(hashes[2])) throw new Error('Reconstructed recovery blob identity mismatch');
  return {relative, original, expected};
}

function frontMatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(raw);
  if (!match) throw new Error('Recovery file lacks complete front matter');
  const data = yaml.load(match[1], {schema: yaml.JSON_SCHEMA});
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid recovery front matter');
  return {data, body: match[2]};
}

function posts(data) {
  const value = data.social?.posts;
  if (!value || typeof value !== 'object' || Array.isArray(value) || !Object.keys(value).length) {
    throw new Error('Semantic recovery requires structured social post records');
  }
  for (const record of Object.values(value)) {
    if (!record || typeof record !== 'object' || Array.isArray(record) ||
        !Object.keys(record).length || Object.entries(record).some(([key, value]) =>
          !['url', 'buffer_id'].includes(key) || typeof value !== 'string' || !value.trim())) {
      throw new Error('Unsupported social post record');
    }
  }
  return value;
}

function requireRecords(expected, current) {
  for (const [platform, record] of Object.entries(expected)) {
    for (const [key, value] of Object.entries(record)) {
      if (current?.[platform]?.[key] !== value) throw new Error('An accepted social URL or Buffer ID is missing or changed');
    }
  }
}

function withoutRecords(data) {
  const copy = structuredClone(data);
  delete copy.publishedAt;
  if (copy.social && typeof copy.social === 'object') delete copy.social.posts;
  return copy;
}

export function checkSemanticRecovery(patch, cwd) {
  validatePatch(patch);
  for (const section of patch.split(/(?=^diff --git )/m)) {
    const {relative, original, expected} = reconstruct(section, cwd);
    const before = frontMatter(original);
    const after = frontMatter(expected);
    // Only social records and publication time may have changed in the artifact.
    if (before.body !== after.body || !isDeepStrictEqual(withoutRecords(before.data), withoutRecords(after.data))) {
      throw new Error('Recovery patch changes more than social records and publishedAt');
    }
    const records = posts(after.data);
    if (before.data.social?.posts) requireRecords(posts(before.data), records);
    const filename = path.join(fs.realpathSync(cwd), relative);
    if (fs.realpathSync(filename) !== filename || !fs.lstatSync(filename).isFile()) {
      throw new Error('Recovery target must remain a regular file without symlink traversal');
    }
    const current = frontMatter(fs.readFileSync(filename, 'utf8'));
    requireRecords(records, current.data.social?.posts);
    if ('publishedAt' in after.data &&
        (typeof after.data.publishedAt !== 'string' || current.data.publishedAt !== after.data.publishedAt)) {
      throw new Error('Recovered publication time is missing or changed');
    }
  }
}

export function checkArchive(archive, {cwd = process.cwd()} = {}) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'social-recovery-'));
  try {
    const zip = path.join(temporary, 'recovery.zip');
    fs.writeFileSync(zip, archive);
    const entries = execFileSync('unzip', ['-Z1', zip], {encoding: 'utf8', maxBuffer: limit, stdio: ['pipe', 'pipe', 'pipe']}).trim().split('\n');
    if (entries.length !== 1 || entries[0] !== patchName) {
      throw new Error('Recovery archive must contain only social-post-state.patch');
    }
    // Stream the one expected entry, never extract archive paths onto the filesystem.
    const patch = execFileSync('unzip', ['-p', zip, patchName], {encoding: 'utf8', maxBuffer: limit, stdio: ['pipe', 'pipe', 'pipe']});
    validatePatch(patch);
    try {
      execFileSync('git', ['apply', '--reverse', '--check', '--'], {
        cwd, input: patch, encoding: 'utf8', maxBuffer: limit, stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch {
      try {
        checkSemanticRecovery(patch, cwd);
      } catch (error) {
        throw new Error(`Recovery patch is not fully restored in this checkout; restore the social records before publishing (${error.message})`, {cause: error});
      }
    }
  } finally {
    fs.rmSync(temporary, {recursive: true, force: true});
  }
}

async function readLimited(response) {
  if (!response.ok) throw new Error(`Artifact download failed (HTTP ${response.status})`);
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > limit) throw new Error('Recovery artifact exceeds size limit');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function checkSocialRecovery({
  repository = process.env.GITHUB_REPOSITORY,
  token = process.env.GH_TOKEN,
  cwd = process.cwd(),
  fetchImpl = fetch,
  log = console.log
} = {}) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository || '') || !token) {
    throw new Error('GITHUB_REPOSITORY and GH_TOKEN with actions:read are required');
  }
  const base = `https://api.github.com/repos/${repository}`;
  const request = url => fetchImpl(url, {
    headers: {Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'},
    redirect: 'manual', signal: AbortSignal.timeout(60_000)
  });
  let checked = 0;
  for (let page = 1; ; page++) {
    const response = await request(`${base}/actions/artifacts?per_page=100&page=${page}`);
    if (!response.ok) throw new Error(`Cannot list recovery artifacts (HTTP ${response.status})`);
    const data = await response.json();
    if (!Array.isArray(data.artifacts)) throw new Error('Invalid artifact list response');
    for (const artifact of data.artifacts) {
      if (!/^social-post-state-\d+-\d+$/.test(artifact.name || '')) continue;
      if (!artifact.workflow_run?.head_branch) throw new Error(`Recovery artifact ${artifact.id} has no branch information`);
      if (artifact.workflow_run.head_branch !== 'main') continue;
      if (!Number.isSafeInteger(artifact.id) || artifact.id <= 0 || artifact.expired) {
        throw new Error(`Recovery artifact ${artifact.id} is expired or invalid; cannot establish that publishing is safe`);
      }
      try {
        let download = await request(`${base}/actions/artifacts/${artifact.id}/zip`);
        if (download.status === 302) {
          const location = new URL(download.headers.get('location'));
          if (location.protocol !== 'https:') throw new Error('Invalid artifact download redirect');
          // The signed storage URL must not receive the GitHub credential.
          download = await fetchImpl(location.href, {redirect: 'error', signal: AbortSignal.timeout(60_000)});
        }
        checkArchive(await readLimited(download), {cwd});
      } catch (error) {
        throw new Error(`Recovery artifact ${artifact.id} (${artifact.name}): ${error.message}`, {cause: error});
      }
      checked++;
      log(`Recovery artifact ${artifact.id}: social records are already restored.`);
    }
    if (data.artifacts.length < 100) break;
  }
  log(`Social recovery gate passed (${checked} artifact(s) checked).`);
  return checked;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  checkSocialRecovery().catch(error => {
    console.error(`Social publishing blocked: ${error.message}`);
    process.exitCode = 1;
  });
}
