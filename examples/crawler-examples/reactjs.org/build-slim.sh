#!/bin/sh
set -e

REPO="reactjs.org"
CUR_DIR=$(pwd)
REPO_DIR="$CUR_DIR/$REPO"
VERSION="dea4f329ea3a7bba116e07adf67eb5c8b6c528cd"
DATE="$(date +'%Y-%m-%d-%H-%M-%S')"

cd "$REPO_DIR"
cp ../yarn.lock ./
yarn --ignore-engines install
yarn --ignore-engines build

cd "$CUR_DIR"
yarn blogsearch-crawler blogsearch.slim.config.js
