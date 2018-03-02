const debug = require('debug')('botfarm:queue:search');
const error = require('debug')('botfarm:error:queue:search');
const { queue } = require('db');

/**
 * This file contains the toolkit for taking from the queue and running bots 
 */

const runDueBots = async () => {
  const now = new Date();
  debug('Checking for due bots')
  const dueBots = await queue.search({ before: now });
  return dueBots;
}


const runBot = queueId => {

}
 
module.exports = { runDueBots, runBot }