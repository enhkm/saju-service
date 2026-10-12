#!/usr/bin/env bash
# GitHub Pages 배포: 정적 사이트를 빌드해 gh-pages 브랜치에 커밋하고 push 한다.
# 사용: npm run deploy:pages   (master 에 커밋된 상태에서 실행)
# 강제 push 없이 gh-pages 브랜치에 배포 커밋을 하나씩 쌓는다.
set -euo pipefail

cd "$(dirname "$0")/.."

REPO_NAME="$(basename -s .git "$(git remote get-url origin)")"
SOURCE_SHA="$(git rev-parse --short HEAD)"

if [ -n "$(git status --porcelain)" ]; then
  echo "커밋하지 않은 변경이 있습니다. 먼저 커밋한 뒤 배포하세요." >&2
  exit 1
fi

echo "▶ 빌드 (경로: /$REPO_NAME)"
rm -rf out
PAGES_REPO="$REPO_NAME" npm run build
# _next 폴더가 무시되지 않도록 Jekyll 처리를 끈다
touch out/.nojekyll

WORKTREE="$(mktemp -d)"
cleanup() { git worktree remove --force "$WORKTREE" >/dev/null 2>&1 || true; }
trap cleanup EXIT

if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch -q origin gh-pages
  git worktree add -q -B gh-pages "$WORKTREE" origin/gh-pages
else
  git worktree add -q --detach "$WORKTREE"
  git -C "$WORKTREE" checkout -q --orphan gh-pages
fi

# 이전 배포 파일을 지우고 새 빌드로 교체 (.git 은 남김)
find "$WORKTREE" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R out/. "$WORKTREE"/

git -C "$WORKTREE" add -A
if git -C "$WORKTREE" diff --cached --quiet; then
  echo "▶ 바뀐 내용이 없어 배포를 건너뜁니다."
  exit 0
fi
git -C "$WORKTREE" commit -q -m "Deploy ${SOURCE_SHA} to GitHub Pages"
git -C "$WORKTREE" push -q origin gh-pages

echo "▶ 배포 완료: https://$(gh api user --jq .login 2>/dev/null || echo '<계정>').github.io/$REPO_NAME/"
