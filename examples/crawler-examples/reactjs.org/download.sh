#!/bin/sh
set -e

REPO="reactjs.org"
CUR_DIR=$(pwd)
REPO_DIR="$CUR_DIR/$REPO"
VERSION="dea4f329ea3a7bba116e07adf67eb5c8b6c528cd"
DATE="$(date +'%Y-%m-%d-%H-%M-%S')"

if [ ! -d "$REPO_DIR" ]; then 
  git clone "https://github.com/reactjs/$REPO"
  cd "$REPO_DIR"
  git checkout -b upstream "$VERSION"
  cd "$CUR_DIR"
fi

cd "$REPO_DIR"
git config user.email "k.bumsik@gmail.com"
git config user.name "Bumsik Kim"
git checkout -b "patch-$DATE" "$VERSION"
# git am $CUR_DIR/*.patch

cd "$CUR_DIR"
