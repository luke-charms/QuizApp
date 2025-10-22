const express = require('express');
const path = require('path');
const dispatcher = require('./dispatcher');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes handled by dispatcher
app.use('/', dispatcher);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`QuizApp running on port ${PORT}`);
  console.log(`Communicating with QuizWorker at ${process.env.WORKER_URL || 'http://quizworker-service:3001'}`);
});