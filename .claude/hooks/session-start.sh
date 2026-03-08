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

# Install plaud-app npm dependencies
PLAUD_DIR="${CLAUDE_PROJECT_DIR:-.}/plaud-app"
if [ -f "${PLAUD_DIR}/package.json" ]; then
  echo "Installing plaud-app dependencies..."
  npm install --prefix "${PLAUD_DIR}"
  echo "plaud-app: dependencies installed"
fi

echo "Session start hook: complete"
