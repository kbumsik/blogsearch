#!/bin/sh
set -e

REPO="reactjs.org"
CURDIR=$(pwd)

cd "./$REPO"
yarn --ignore-engines upgrade
cp yarn.lock ../
cd $CURDIR
