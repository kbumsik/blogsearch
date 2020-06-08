#!/bin/sh
set -e

REPO="circleci-docs"
CUR_DIR=$(pwd)
REPO_DIR="$CUR_DIR/$REPO"
VERSION="05f4b70c8a534119f2b708691659d79e95e69240"
DATE="$(date +'%Y-%m-%d-%H-%M-%S')"

# Apply slim version patch
cd "$REPO_DIR"
git am ../*slim*.patch

# Then build
cd "$REPO_DIR"
npm install
npm run webpack-prod
JEKYLL_UID=$(id -u) JEKYLL_GID=$(id -g) docker-compose up --build
cp *.slim.db.wasm ../

# Go back to the previous commit
cd "$REPO_DIR"
git checkout HEAD^

cd "$CUR_DIR"
