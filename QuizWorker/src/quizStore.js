const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const mongoUrl = process.env.MONGO_URL || 'mongodb://textstore-service:27017/quizdb';
console.log(`Connecting to MongoDB at ${mongoUrl}...`);

// Function that continuously tries reconnecting to MongoDB
async function connectWithRetry() {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error('MongoDB connection failed, retrying in 5 seconds...', err.message);
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();

// Define schema and model
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answerIndex: Number,
  createdAt: { type: Date, default: Date.now },
});

const Question = mongoose.model('Question', questionSchema);

// Add question
async function addQuestion(data) {
  const q = new Question(data);
  const saved = await q.save();
  console.log(`Saved question: "${saved.question}"`);
  return saved;
}

// Get random question
async function getRandomQuestion() {
  const count = await Question.countDocuments();
  console.log(`Total questions in DB: ${count}`);
  if (count === 0) return null;

  const random = Math.floor(Math.random() * count);
  const question = await Question.findOne().skip(random);
  return question;
}

// Get question by ID
async function getQuestionById(id) {
  return await Question.findById(id);
}

module.exports = {
  addQuestion,
  getRandomQuestion,
  getQuestionById
};