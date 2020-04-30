#!/bin/sh
set -e

REPO="circleci-docs"
CUR_DIR=$(pwd)
REPO_DIR="$CUR_DIR/$REPO"
VERSION="05f4b70c8a534119f2b708691659d79e95e69240"
DATE="$(date +'%Y-%m-%d-%H-%M-%S')"

cd "$REPO_DIR"
npm install
npm run webpack-prod
JEKYLL_UID=$(id -u) JEKYLL_GID=$(id -g) docker-compose up --build
cp *.db.wasm ../

cd "$CUR_DIR"
