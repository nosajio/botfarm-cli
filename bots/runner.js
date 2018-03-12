const debug = require('debug')('botfarm:runner');
const error = require('debug')('botfarm:error:runner');
const path = require('path');
const { spawn } = require('child_process');
const { loadDueBots } = require('./loader');
const { outputs } = require('db');

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
      outputs.capture('stdout', data.toString(), bot.farm_id, bot.bot_name);
    });
  }
  if (botProcess.stderr) {
    botProcess.stderr.on('data', data => {
      outputs.capture('stderr', data.toString(), bot.farm_id, bot.bot_name);      
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
  return dueBots;
}
 
module.exports = { runDueBots }