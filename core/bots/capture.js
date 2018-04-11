const debug = require('debug')('botfarm:capture');
const error = require('debug')('botfarm:error:capture');
const path = require('path');
const { outputs } = require('core/db');

/**
 * Save a regular bot output
 * @param {string} output 
 * @param {number} repo_id 
 * @param {string} bot_name 
 * @param {string} repo_name 
 * @param {number} startTime a unix timestamp
 */
const capture = (output, repo_id, bot_name, repo_name, startTime) => {
  if (! output) {
    return;
  }
  outputs.capture('stdout', output, repo_id, bot_name, repo_name, startTime);
}

/**
 * Save an error output
 * @param {string} error 
 * @param {number} repo_id 
 * @param {string} bot_name 
 * @param {string} repo_name 
 * @param {number} startTime 
 */
const captureError = (error, repo_id, bot_name, repo_name, startTime) => {
  if (! error) {
    return;
  }
  outputs.capture('stderr', error, repo_id, bot_name, repo_name, startTime);
}

/**
 * Persist output in memory until the stream ends, then flush data to database
 * @param {ChildProcess} botProcess 
 * @param {object} bot 
 * @param {number} startTime 
 */
const captureOutputStream = (botProcess, bot, startTime) => {
  // 0: stdout, 1: stderr
  const outputs = ['', ''];

  const appendOutput = (index, str) => {
    if (index > 1) return;
    outputs[index] += str;
  }
  
  if (botProcess.stdout) {
    botProcess.stdout.on('data', data =>  appendOutput(0, data.toString()) );
    botProcess.stdout.on('end', () =>     capture(outputs[0], bot.repo_id, bot.bot_name, bot.repo_name, startTime) );
  }
  if (botProcess.stderr) {
    botProcess.stderr.on('data', data =>  appendOutput(1, data.toString()));
    botProcess.stderr.on('end', () =>     captureError(outputs[1], bot.repo_id, bot.bot_name, bot.repo_name, startTime));
  }
}

module.exports = { captureOutputStream, capture, captureError }