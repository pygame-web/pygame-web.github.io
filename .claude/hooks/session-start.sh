#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo "Session start hook: pygame-web.github.io"

# Verify git is available and the repo is intact
if ! git -C "${CLAUDE_PROJECT_DIR:-.}" rev-parse --git-dir > /dev/null 2>&1; then
  echo "Warning: Not inside a git repository"
  exit 0
fi

echo "Git repo: OK"

# Check for any markdown linter if available (markdownlint-cli)
if command -v markdownlint &> /dev/null; then
  echo "markdownlint: available"
else
  echo "markdownlint: not installed (optional)"
fi

echo "Session start hook: complete"
