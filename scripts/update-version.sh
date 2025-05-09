#!/bin/bash
GIT_COMMIT_SHA=$(git rev-parse --short HEAD)
echo "export const version = \"${GIT_COMMIT_SHA}\";" > ./lib/version.ts
