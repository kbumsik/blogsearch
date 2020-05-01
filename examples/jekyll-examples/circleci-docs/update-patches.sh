#!/bin/sh
set -e

REPO="circleci-docs"
CUR_DIR=$(pwd)
REPO_DIR="$CUR_DIR/$REPO"
VERSION="05f4b70c8a534119f2b708691659d79e95e69240"
DATE="$(date +'%Y-%m-%d-%H-%M-%S')"

rm -f $CUR_DIR/*.patch
cd "$REPO_DIR"
git format-patch "$VERSION" -o "$CUR_DIR"

cd "$CUR_DIR"
