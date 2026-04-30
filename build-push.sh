#!/usr/bin/env bash
set -euo pipefail

# Variables for registry and image
REGISTRY="ghcr.io"
ORG="joshua-clayton"
REPONAME="hawkbitgui"
SRC_REPO="http://github.com/$ORG/$REPONAME"
IMAGE="$REGISTRY/$ORG/$REPONAME"

# Tags that will be applied to the image
SHA=$(git rev-parse --short HEAD)
VERSION=$(git describe --tags --always --dirty)

echo $GITHUB_TOKEN | docker login $REGISTRY -u $GITHUB_USER --password-stdin

docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --label "org.opencontainers.image.source=$SRC_REPO" \
  --target production-build-stage \
  -t "$IMAGE:latest" \
  -t "$IMAGE:$VERSION" \
  -t "$IMAGE:$SHA" \
  --push \
  .
