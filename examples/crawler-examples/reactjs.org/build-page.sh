#!/bin/sh
set -e

REPO="reactjs.org"
CUR_DIR=$(pwd)
REPO_DIR="$CUR_DIR/$REPO"
VERSION="dea4f329ea3a7bba116e07adf67eb5c8b6c528cd"
PAGE_SOURCE_TARBALL="page_source.tar.gz"

if [ ! -d "$REPO_DIR" ]; then
  wget --quiet https://github.com/reactjs/$REPO/archive/$VERSION.tar.gz \
    -O $PAGE_SOURCE_TARBALL
  tar -xzf $PAGE_SOURCE_TARBALL
  mv $REPO-$VERSION $REPO
fi

cd "$REPO_DIR"
cp ../yarn.lock ./
pwd
yarn --ignore-engines install
yarn --ignore-engines build

cd "$CUR_DIR"
