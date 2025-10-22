#!/bin/bash

# QuizApp Kubernetes Deployment Script

# Color codes
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Global Variables
QUIZAPP_IMAGE="lukicharms/quizappv1"
QUIZWORKER_IMAGE="lukicharms/quizworkerv1"
QUIZAPP_DIR="./Quizapp"
QUIZWORKER_DIR="./Quizworker"

# Build QuizApp image
echo -e "${BLUE}  Building QuizApp Docker image...${NC}"
cd "$QUIZAPP_DIR"
docker build -t "${QUIZAPP_IMAGE}:latest" .
cd ..

# Build QuizWorker image
echo -e "${BLUE}  Building QuizWorker Docker image...${NC}"
cd "$QUIZWORKER_DIR"
docker build -t "${QUIZWORKER_IMAGE}:latest" .
cd ..

# Push QuizApp image
echo -e "${BLUE}  Pushing QuizApp image to Docker Hub...${NC}"
docker push "${QUIZAPP_IMAGE}:latest"

# Push QuizWorker image
echo -e "${BLUE}  Pushing QuizWorker image to Docker Hub...${NC}"
docker push "${QUIZWORKER_IMAGE}:latest"

# Apply Kubernetes configuration
echo -e "${BLUE}  Applying Kubernetes configuration...${NC}"
kubectl apply -f ./k8s/quizapp-deployment.yaml

sleep 2

# Delete existing pods
echo -e "${BLUE}  Deleting existing QuizApp pods...${NC}"
kubectl delete pods -l app=quizapp

echo -e "${BLUE}  Deleting existing QuizWorker pods...${NC}"
kubectl delete pods -l app=quizworker

# Restart deployments
echo -e "${BLUE}  Restarting QuizApp deployment...${NC}"
kubectl rollout restart deployment quizapp-deployment

echo -e "${BLUE}  Restarting QuizWorker deployment...${NC}"
kubectl rollout restart deployment quizworker-deployment

# Wait for rollout
echo -e "${BLUE}  Waiting for QuizApp deployment to complete...${NC}"
kubectl rollout status deployment quizapp-deployment --timeout=120s

echo -e "${BLUE}  Waiting for QuizWorker deployment to complete...${NC}"
kubectl rollout status deployment quizworker-deployment --timeout=120s

# Deployment status
echo ""
echo -e "${BLUE}  Deployment Status:${NC}"
kubectl get deployments

# Pod status
echo ""
echo -e "${BLUE}  Pod Status:${NC}"
kubectl get pods

# Service status
echo ""
echo -e "${BLUE}  Service Status:${NC}"
kubectl get services

# Finished
echo ""
echo -e "${BLUE}   Deployment Complete${NC}"

sleep 3

# Check logs
echo ""
echo -e "${RED}  QuizApp LOGS${NC}"
kubectl logs deploy/quizapp-deployment

echo ""
echo -e "${RED}  QuizWORKER LOGS${NC}"
kubectl logs deploy/quizworker-deployment
