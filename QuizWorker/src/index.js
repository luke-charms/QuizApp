process.on('unhandledRejection', (reason) => {
  console.error('[QuizWorker:UNHANDLED]', reason);
});

const express = require('express');
const { log, error } = require('./utils/logger');
const quizStore = require('./quizStore');

const app = express();
app.use(express.json());

const INTERVAL = process.env.INTERVAL || 15000;

let hasAddedExample = false;

// Get random question from database
app.get('/api/question', async (req, res) => {
  try {
    log('GET /api/question request recieved');
    
    const question = await quizStore.getRandomQuestion();
    
    if (!question) {
      log('No questions in database');
      return res.status(200).json({ message: 'No questions found' });
    }
    
    log(`Returning question: "${question.question}"`);
    res.json(question);
  } catch (err) {
    error(`Failed to fetch question from database: ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Add question to database
app.post('/api/addQuestion', async (req, res) => {
  try {
    const { question, options, answerIndex } = req.body;
    
    log(`POST /api/addQuestion - Adding to database: "${question}"`);
    
    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Invalid question format' });
    }

    const saved = await quizStore.addQuestion({
      question,
      options,
      answerIndex: Number(answerIndex) || 0
    });

    log(`Question added with ID: ${saved._id}`);
    res.status(201).json({ id: saved._id });
  } catch (err) {
    error(`Failed to add question: ${err.message}`);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// Check answer against database
app.post('/api/checkAnswer', async (req, res) => {
  try {
    const { questionId, selectedIndex } = req.body;
    
    log(`POST /api/checkAnswer - Checking answer for question ${questionId}`);
    
    const question = await quizStore.getQuestionById(questionId);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = Number(selectedIndex) === question.answerIndex;
    
    log(`Answer check: ${isCorrect ? 'Correct' : 'Incorrect'}`);
    
    res.json({ 
      correct: isCorrect,
      correctAnswer: question.options[question.answerIndex]
    });
  } catch (err) {
    error(`Failed to check answer: ${err.message}`);
    res.status(500).json({ error: 'Failed to check answer' });
  }
});

// Helper function to continuously check if the database is empty
async function runWorker() {
  try {    
    log(`Checking for available quiz questions...`);
    const question = await quizStore.getRandomQuestion();
    
    if (question) {
      log(`Found question: "${question.question}"`);
      hasAddedExample = false;
    } else if (!hasAddedExample) {
      log(`No questions found, adding example question.`);
      const saved = await quizStore.addQuestion({
        question: "What color is the sky?",
        options: ["Blue", "Green", "Red", "Yellow"],
        answerIndex: 0
      });
      
      if (saved) {
        hasAddedExample = true;
        log(`Example question added with ID: ${saved._id}`);
      }
    } else {
      log(`No questions available (example already added)`);
    }
  } catch (err) {
    error(`Worker loop failed: ${err.message}`);
  }
}

// QuizWorker main function
async function main() {
  log('QuizWorker started!');
  
  // Start REST API server
  const PORT = 3001;
  app.listen(PORT, () => {
    log(`REST API listening on port ${PORT}`);
  });
  
  // Start periodic worker
  await runWorker();
  setInterval(runWorker, INTERVAL);
}

main();