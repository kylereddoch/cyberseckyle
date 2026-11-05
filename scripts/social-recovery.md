# Social publishing recovery gate

Run `node scripts/check-social-recovery.mjs` before any social publisher. It needs
`GITHUB_REPOSITORY`, `GH_TOKEN` (the job's GitHub token with `actions: read`), Git,
and `unzip`. Run on a fresh main checkout, inside the same serialized publishing
job as the publishers. The check is read-only: it does not apply patches, mutate
artifacts, or post to social platforms.

The gate lists every page of repository Actions artifacts and examines artifacts
named `social-post-state-<run>-<attempt>` whose `workflow_run.head_branch` is
`main`. It does not skip previous attempts of the current run. Each zip must
contain exactly `social-post-state.patch`, describing text modifications to
existing Markdown files under `src/posts`, `src/notes`, or `src/now`. Unknown
paths/formats, binary or mode changes, malformed archives, missing branch
metadata, expired artifacts, HTTP failures, and unreadable patches block
publishing. Downloads and extracted patch output are limited to 10 MiB.

A patch is resolved only when `git apply --reverse --check` succeeds against the
current checkout. Nothing is actually reversed. If the gate blocks, inspect the
identified artifact and restore its accepted social IDs, URLs, and publication
time into main before rerunning. Do not rerun a publisher to recover metadata.
The previously recovered TypeDraw archive (artifact 13462212795, run
42128228042 attempt 1) passes this check after restoration.

## Limits

- Artifact retention is not a durable ledger. GitHub may remove expired or
  deleted artifacts from listings entirely; the gate cannot detect artifacts it
  cannot see. Listed expired artifacts block, even if they may have been restored.
- A publisher crash before it saves metadata, or a failure before artifact upload,
  can leave an external post without a recovery patch. This gate cannot discover
  those posts. It does not provide exactly-once delivery.
- Later edits near restored metadata can make the reverse check fail even when
  the original post records are present. This intentionally blocks for manual
  review instead of guessing. Recovery artifacts are not auto-deleted.
- Branch filtering depends on GitHub's workflow-run metadata. Non-main artifacts
  are ignored. Missing branch metadata blocks for review.
- All visible artifacts are paginated. Listing and download errors block rather
  than allowing posting. Concurrent changes to artifact listings are not an
  atomic snapshot; keep publishers serialized with workflow concurrency.

Focused tests: `node --test test/social-recovery.test.mjs`.
