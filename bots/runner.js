const debug = require('debug')('botfarm:runner');
const error = require('debug')('botfarm:error:runner');
const path = require('path');
const is = require('is_js');
const { spawn } = require('child_process');
const { loadDueBots, loadBot } = require('./loader');
const { captureOutputStream } = require('./capture');

/**
 * This file contains the toolkit for taking from the queue and running bots 
 */

const spawnBotProcess = (bot) => {
  const processFile = path.resolve(__dirname, 'spawn-process.js');
  const spawnedProcess = spawn('node', [processFile], {
    env: Object.assign({}, process.env, { 'BOT': JSON.stringify(bot) }),
  });
  spawnedProcess.on('error', (err) => { throw err; } );
  return spawnedProcess;
}

const runDueBots = async () => {
  const dueBots = await loadDueBots();
  if (! dueBots) {
    return null;
  }
  dueBots.forEach(b => {
    try {
      const timeBeforeStart = Date.now(); // Time in milliseconds before the bot process is started      
      const botProcess = spawnBotProcess(b);
      captureOutputStream(botProcess, b, timeBeforeStart);
    } catch(err) {
      error(err);
    }
  });
  return dueBots;
}

/**
 * Locate a bot, load it, then run it
 * @param {string} repoName the directory name containing the bot
 * @param {string} botName name / filename of the bot
 */
const loadAndRunBot = async (repoName, botName) => {
  try {
    const loadedBot = await loadBot(repoName, botName);
    if (is.not.object(loadedBot)) {
      throw new Error('Bot doesn\'t exist.');
    }
    const timeBeforeStart = Date.now(); // Time in milliseconds before the bot process is started
    const botProcess = spawnBotProcess(loadedBot);
    captureOutputStream(botProcess, loadedBot, timeBeforeStart);
  } catch(err) {
    throw err;
  }
}

module.exports = { runDueBots, loadAndRunBot }