#!/bin/sh
set -e

REPO="circleci-docs"
CUR_DIR=$(pwd)
REPO_DIR="$CUR_DIR/$REPO"
VERSION="05f4b70c8a534119f2b708691659d79e95e69240"
DATE="$(date +'%Y-%m-%d-%H-%M-%S')"

if [ ! -d "$REPO_DIR" ]; then 
  git clone "https://github.com/circleci/$REPO"
  cd "$REPO_DIR"
  git checkout -b upstream "$VERSION"
  cd "$CUR_DIR"
fi

cd "$REPO_DIR"
git config user.email "k.bumsik@gmail.com"
git config user.name "Bumsik Kim"
git stash
git checkout -b "patch-$DATE" "$VERSION"
# Apply patches
find $CUR_DIR -maxdepth 1 -type f \
  -name *.patch \
  ! -name *slim*.patch \
  -exec git am {} +

cd "$CUR_DIR"
