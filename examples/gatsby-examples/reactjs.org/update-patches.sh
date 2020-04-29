#!/bin/sh
set -e

REPO="reactjs.org"
CUR_DIR=$(pwd)
REPO_DIR="$CUR_DIR/$REPO"
VERSION="dea4f329ea3a7bba116e07adf67eb5c8b6c528cd"
DATE="$(date +'%Y-%m-%d-%H-%M-%S')"

rm -f "$CUR_DIR/*.patch"
cd "$REPO_DIR"
git format-patch "$VERSION" -o "$CUR_DIR"

cd "$CUR_DIR"
