#!/bin/sh
set -e

REPO="kubernetes.io"
CUR_DIR=$(pwd)
REPO_DIR="$CUR_DIR/$REPO"
VERSION="ec822d9408e7824429e5396d045a564919392062"
DATE="$(date +'%Y-%m-%d-%H-%M-%S')"

if [ ! -d "$REPO_DIR" ]; then 
  git clone "https://github.com/kubernetes/website" $REPO
  cd "$REPO_DIR"
  git checkout -b upstream "$VERSION"
  cd "$CUR_DIR"
fi

cd "$REPO_DIR"
git config user.email "k.bumsik@gmail.com"
git config user.name "Bumsik Kim"
git stash
git checkout -b "patch-$DATE" "$VERSION"
# git am $CUR_DIR/*.patch

cd "$CUR_DIR"