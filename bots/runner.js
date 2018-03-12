const debug = require('debug')('botfarm:runner');
const error = require('debug')('botfarm:error:runner');
const path = require('path');
const { spawn } = require('child_process');
const { loadDueBots } = require('./loader');

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

const captureOutput = (botProcess, bot) => {
  if (botProcess.stdout) {
    botProcess.stdout.on('data', data => {
      debug('Stdout for %s:  %s', bot.bot_name, data);
    });
  }
  if (botProcess.stderr) {
    botProcess.stderr.on('data', data => {
      error('Stderr for %s:  %s', bot.bot_name, data);
    });
  }
}

const runDueBots = async () => {
  const dueBots = await loadDueBots();
  dueBots.forEach(b => {
    try {
      const botProcess = spawnBotProcess(b);
      captureOutput(botProcess, b);
    } catch(err) {
      error(err);
    }
  });
}
 
module.exports = { runDueBots }