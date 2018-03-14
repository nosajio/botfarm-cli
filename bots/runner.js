const debug = require('debug')('botfarm:runner');
const error = require('debug')('botfarm:error:runner');
const path = require('path');
const { spawn } = require('child_process');
const { loadDueBots } = require('./loader');
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
 
module.exports = { runDueBots }