# Connect to MongoDB pod and open mongosh shell
kubectl exec -it textstore-0 -- mongosh quizdb

# Inside the MongoDB shell:
db.questions.deleteMany({})

# Verify deletion
db.questions.countDocuments()
# Should return: 0

# Exit
exit