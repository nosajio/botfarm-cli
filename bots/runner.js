const debug = require('debug')('botfarm:queue:search');
const error = require('debug')('botfarm:error:queue:search');
const { loadDueBots } = require('./loader');

/**
 * This file contains the toolkit for taking from the queue and running bots 
 */

const runDueBots = async () => {
  const dueBots = await loadDueBots();

}


const runBot = queueId => {

}
 
module.exports = { runDueBots, runBot }