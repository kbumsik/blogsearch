#!/bin/sh
set -e

REPO="reactjs.org"
CUR_DIR=$(pwd)
REPO_DIR="$CUR_DIR/$REPO"
VERSION="dea4f329ea3a7bba116e07adf67eb5c8b6c528cd"
DATE="$(date +'%Y-%m-%d-%H-%M-%S')"

# Link gatsby-plugin-blogsearch first
cd "$CUR_DIR/../../../gatsby-plugin-blogsearch"
yarn link
cd "$REPO_DIR"
yarn link gatsby-plugin-blogsearch

# Apply slim version patch
cd "$REPO_DIR"
git am ../*slim*.patch

# Then build
cd "$REPO_DIR"
yarn install
yarn reset
yarn build
cp *.slim.db.wasm ../

# Go back to the previous commit
cd "$REPO_DIR"
git checkout HEAD^

cd "$CUR_DIR"
