#!/bin/bash

# Build script for the ping-pong application

echo "Building ping-pong image..."
docker build -t rahul004x/pingpong:v3 .

echo "Build completed!"
echo ""
echo "To push the image to registry:"
echo "docker push rahul004x/pingpong:v3"
echo ""
echo "To deploy to Kubernetes:"
echo "kubectl apply -f manifests/"
