const debug = require('debug')('botfarm:queue:search');
const error = require('debug')('botfarm:error:queue:search');
const { fork } = require('child_process');
const { loadDueBots } = require('./loader');

/**
 * This file contains the toolkit for taking from the queue and running bots 
 */

const runBotInForkedProcess = filePath => {
  const forkedProcess = fork(filePath);
}

const runDueBots = async () => {
  const dueBots = await loadDueBots();
  dueBots.forEach(b => runBotInForkedProcess(b.loader));
}
 
module.exports = { runDueBots }