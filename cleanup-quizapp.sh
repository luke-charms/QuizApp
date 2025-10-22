#!/bin/bash
# cleanup-quizapp.sh

echo "Cleaning up QuizApp deployment..."

kubectl delete -f k8s/quizapp-deployment.yaml

sleep 3

echo ""
echo "Deployment deleted!"
echo ""
echo "Checking for remaining resources..."
kubectl get pods
echo ""
kubectl get services
echo ""
kubectl get pvc

echo ""
echo "Cleanup complete!"