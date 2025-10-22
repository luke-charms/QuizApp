// QuizWorker/src/utils/logger.js
function log(msg) {
  console.log(`[QuizWorker] ${new Date().toISOString()} - ${msg}`);
}

function error(msg) {
  console.error(`[QuizWorker:ERROR] ${new Date().toISOString()} - ${msg}`);
}

module.exports = { log, error };
