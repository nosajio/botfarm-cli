const debug = require('debug')('botfarm:queue:search');
const error = require('debug')('botfarm:error:queue:search');
const { queue, farms } = require('db');
const { findBotfile } = require('filesystem');

/**
 * This file contains the toolkit for taking from the queue and running bots 
 */

const runDueBots = async () => {
  const now = new Date();
  debug('Checking for due bots')
  const dueBots = await queue.search({ before: now });
  debug(dueBots)
  // Run all due bots
  dueBots.forEach(bot => {
    farms.findOne(bot.farm_id)
      .then(farm => debug(farm));
  });
  return dueBots;
}


const runBot = queueId => {

}
 
module.exports = { runDueBots, runBot }