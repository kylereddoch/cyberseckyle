#!/usr/bin/env bash
set -euo pipefail

commit_message="${1:-Deploy $(git rev-parse HEAD)}"

git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

deploy_dir="$(mktemp -d)"

if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch origin gh-pages --depth=1
  git worktree add --detach "${deploy_dir}" origin/gh-pages
else
  git worktree add --detach "${deploy_dir}"
  git -C "${deploy_dir}" checkout --orphan gh-pages
fi

find "${deploy_dir}" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -a dist/. "${deploy_dir}/"
touch "${deploy_dir}/.nojekyll"
printf '%s\n' 'www.kylereddoch.me' > "${deploy_dir}/CNAME"

git -C "${deploy_dir}" add --all

if git -C "${deploy_dir}" diff --cached --quiet; then
  echo "No deploy changes."
else
  git -C "${deploy_dir}" commit -m "${commit_message}"
  git -C "${deploy_dir}" push origin HEAD:gh-pages --force
fi
