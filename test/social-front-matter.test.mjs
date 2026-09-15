import assert from 'node:assert/strict';
import test from 'node:test';
import yaml from 'js-yaml';

import {
  getSocialBufferId,
  getSocialPostUrl,
  getSocialStatus,
  getSocialTags,
  setSocialPostValues,
  shouldPublishTo
} from '../scripts/social-front-matter.mjs';

function parseDocument(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert.ok(match);

  return {
    header: match[1],
    body: raw.slice(match[0].length),
    lineEnding: raw.includes('\r\n') ? '\r\n' : '\n',
    data: yaml.load(match[1]) || {}
  };
}

test('the social platform list opts in without blank URL fields', () => {
  const data = {
    social: {
      post_to: ['mastodon', 'x', 'linkedin'],
      tags: ['Cybersecurity', 'InfoSec'],
      status: {linkedin: 'Read {title}: {url}'}
    }
  };

  assert.equal(shouldPublishTo(data, 'mastodon'), true);
  assert.equal(shouldPublishTo(data, 'x'), true);
  assert.equal(shouldPublishTo(data, 'linkedin'), true);
  assert.deepEqual(getSocialTags(data, 'linkedin'), ['Cybersecurity', 'InfoSec']);
  assert.equal(getSocialStatus(data, 'linkedin'), 'Read {title}: {url}');
});

test('recorded social posts are not eligible for duplicate publishing', () => {
  const data = {
    social: {
      post_to: ['mastodon', 'x'],
      posts: {
        mastodon: {url: 'https://example.social/@author/1'},
        x: {url: 'https://x.com/author/status/1', buffer_id: 'buffer-1'}
      }
    }
  };

  assert.equal(shouldPublishTo(data, 'mastodon'), false);
  assert.equal(shouldPublishTo(data, 'x'), false);
  assert.equal(shouldPublishTo(data, 'linkedin'), false);
  assert.equal(getSocialPostUrl(data, 'x'), 'https://x.com/author/status/1');
  assert.equal(getSocialBufferId(data, 'x'), 'buffer-1');
});

test('publishing state is added without removing custom status copy', () => {
  const raw = `---
title: Example
social:
  post_to: [mastodon, x, linkedin]
  tags: [Cybersecurity, InfoSec]
  status:
    linkedin: |-
      A custom introduction.

      {title}

      {url}
---
Body
`;
  const parsed = parseDocument(raw);
  const updated = setSocialPostValues(
    raw,
    parsed,
    'linkedin',
    {
      url: 'https://www.linkedin.com/feed/update/urn:li:activity:1',
      buffer_id: 'buffer-linkedin-1'
    },
    {publishedAt: '2026-09-15T20:00:00.000Z'}
  );
  const updatedData = parseDocument(updated).data;

  assert.equal(updatedData.social.status.linkedin, 'A custom introduction.\n\n{title}\n\n{url}');
  assert.equal(
    updatedData.social.posts.linkedin.url,
    'https://www.linkedin.com/feed/update/urn:li:activity:1'
  );
  assert.equal(updatedData.social.posts.linkedin.buffer_id, 'buffer-linkedin-1');
  assert.equal(updatedData.publishedAt, '2026-09-15T20:00:00.000Z');
});

test('legacy fields remain readable and writable during migration', () => {
  const raw = `---
title: Legacy example
x_post: true
x_url:
mastodon_tags: [Cybersecurity]
---
Body
`;
  const parsed = parseDocument(raw);

  assert.equal(shouldPublishTo(parsed.data, 'x'), true);
  assert.deepEqual(getSocialTags(parsed.data, 'x'), ['Cybersecurity']);

  const updated = setSocialPostValues(raw, parsed, 'x', {
    url: 'https://x.com/author/status/2',
    buffer_id: 'buffer-2'
  });
  const updatedData = parseDocument(updated).data;

  assert.equal(updatedData.x_url, 'https://x.com/author/status/2');
  assert.equal(updatedData.x_buffer_post_id, 'buffer-2');
});
