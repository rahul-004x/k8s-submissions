#!/bin/bash

# Build script for the two-container log application

echo "Building log-generator image..."
docker build -f dockerfile.generator -t rahul004x/log-generator:v3 .

echo "Building log-reader image..."  
docker build -f dockerfile.reader -t rahul004x/log-reader:v3 .

echo "Build completed!"
echo ""
echo "To push the images to registry:"
echo "docker push rahul004x/log-generator:v3"
echo "docker push rahul004x/log-reader:v3"
echo ""
echo "To deploy to Kubernetes:"
echo "kubectl apply -f manifests/"
