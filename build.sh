#!/bin/bash

# Set variables
SERVICE_NAME="product-service"
DOCKERFILE_PATH="./Dockerfile"
DOCKER_REGISTRY="gcr.io/HighSole"
VERSION=$(git rev-parse --short HEAD)

# Build Docker image
docker build -t $DOCKER_REGISTRY/$SERVICE_NAME:$VERSION -f $DOCKERFILE_PATH .

# Push Docker image to GCR
docker push $DOCKER_REGISTRY/$SERVICE_NAME:$VERSION
