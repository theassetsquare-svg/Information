#!/usr/bin/env bash
set -euo pipefail

# Auto-add, commit, and push all changes to trigger GitHub Actions deploy.
# Usage: ./scripts/auto_push.sh "optional commit message"

msg=${1:-"chore: automated deploy $(date -u +'%Y-%m-%dT%H:%M:%SZ')"}

git add -A

if git diff --cached --quiet; then
  echo "No changes to commit."
  exit 0
fi

git commit -m "$msg"

git push
