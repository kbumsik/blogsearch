#!/bin/sh
set -e

REPO="kubernetes.io"
CUR_DIR=$(pwd)
REPO_DIR="$CUR_DIR/$REPO"
VERSION="ec822d9408e7824429e5396d045a564919392062"
DATE="$(date +'%Y-%m-%d-%H-%M-%S')"

# Build website using hugo command
cd "$REPO_DIR"
hugo
# To run a test web server
# hugo server --bind 0.0.0.0

cd "$CUR_DIR"
yarn blogsearch-crawler
