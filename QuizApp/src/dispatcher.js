const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const WORKER_URL = process.env.WORKER_URL || 'http://quizworker-service:3001';

// Home page - Render quiz UI
router.get('/', async (req, res) => {
  console.log('User joined');
  try {
    // Fetch question from QuizWorker
    const response = await fetch(`${WORKER_URL}/api/question`);
    
    if (!response.ok) {
      throw new Error(`Worker responded with ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.message === 'No questions found') {
      return res.render('index', { 
        question: null,
        message: 'No questions available yet! Add some questions first.' 
      });
    }
    
    console.log(`Returning question: "${data.question}"`);
    res.render('index', { question: data, message: null });
  } catch (err) {
    console.error('Error fetching question:', err);
    res.status(500).render('index', { 
      question: null, 
      message: 'Error loading question. Please try again.' 
    });
  }
});

// API endpoint for getting random question as JSON
router.get('/api/question', async (req, res) => {
  console.log('GET /api/question request received');
  try {
    const response = await fetch(`${WORKER_URL}/api/question`);
    
    if (!response.ok) {
      throw new Error(`Worker responded with ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Returning question from worker`);
    res.json(data);
  } catch (err) {
    console.error('Error fetching question:', err);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Render form to add a question
router.get('/addQuestion', (req, res) => {
  console.log('User adding new question');
  res.render('addQuestion', { success: false, error: null });
});

// Add a new question (POST)
router.post('/addQuestion', async (req, res) => {
  try {
    const { question, options, answerIndex } = req.body;
    const parsedOptions = Array.isArray(options)
      ? options
      : options.split(',').map(o => o.trim());

    if (!question || parsedOptions.length < 2) {
      // Check if it's a JSON request or form submission
      if (req.headers['content-type'] === 'application/json') {
        return res.status(400).json({ error: 'Invalid question format' });
      }
      return res.render('addQuestion', { 
        success: false, 
        error: 'Please provide a question and at least 2 options' 
      });
    }

    // Forward to QuizWorker
    const response = await fetch(`${WORKER_URL}/api/addQuestion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        options: parsedOptions,
        answerIndex: Number(answerIndex) || 0
      })
    });

    if (!response.ok) {
      throw new Error(`Worker responded with ${response.status}`);
    }

    const result = await response.json();

    // Return JSON for API calls, render HTML for form submissions
    if (req.headers['content-type'] === 'application/json') {
      return res.status(201).json(result);
    }

    res.render('addQuestion', { 
      success: true, 
      error: null,
      questionId: result.id 
    });

    console.log(`Added question: "${question}"`);
  } catch (err) {
    console.error('Error adding question:', err);
    
    if (req.headers['content-type'] === 'application/json') {
      return res.status(500).json({ error: 'Failed to add question' });
    }
    
    res.render('addQuestion', { 
      success: false, 
      error: 'Failed to add question. Please try again.' 
    });
  }
});

// Check answer endpoint
router.post('/api/checkAnswer', async (req, res) => {
  try {
    const { questionId, selectedIndex } = req.body;
    
    // Forward to QuizWorker
    const response = await fetch(`${WORKER_URL}/api/checkAnswer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, selectedIndex })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error('Error checking answer:', err);
    res.status(500).json({ error: 'Failed to check answer' });
  }
});

module.exports = router;