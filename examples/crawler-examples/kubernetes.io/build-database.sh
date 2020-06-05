#!/bin/sh
set -e

REPO="kubernetes.io"
CUR_DIR=$(pwd)
REPO_DIR="$CUR_DIR/$REPO"
VERSION="042df6cef526e54bb724fd02ac80277506548291"
DATE="$(date +'%Y-%m-%d-%H-%M-%S')"

# Build website using hugo command
cd "$REPO_DIR"
hugo
# To run a test web server
# hugo server --bind 0.0.0.0

cd "$CUR_DIR"
yarn blogsearch-crawler
