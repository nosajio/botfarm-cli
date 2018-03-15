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
  const spawnedProcess = spawn('node', ['./bots/spawn-process.js'], {
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
      const botProcess = spawnBotProcess(b);
      captureOutputStream(botProcess, b);
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
    const botProcess = spawnBotProcess(loadedBot);
    captureOutputStream(botProcess, loadedBot);
  } catch(err) {
    throw err;
  }
}
 
module.exports = { runDueBots, loadAndRunBot }