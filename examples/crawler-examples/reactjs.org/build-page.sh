#!/bin/sh
set -e

REPO="reactjs.org"
VERSION="dea4f329ea3a7bba116e07adf67eb5c8b6c528cd"
PAGE_SOURCE_TARBALL="page_source.tar.gz"
CURDIR=$(pwd)

if [ ! -d "$REPO" ]; then
  wget https://github.com/reactjs/$REPO/archive/$VERSION.tar.gz \
    -O $PAGE_SOURCE_TARBALL
  tar -xzf $PAGE_SOURCE_TARBALL
  mv $REPO-$VERSION $REPO
fi
cd $REPO
yarn --ignore-engines upgrade
yarn --ignore-engines install --no-bin-links
yarn --ignore-engines build

cd $CURDIR
