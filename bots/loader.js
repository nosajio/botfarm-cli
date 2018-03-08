const debug = require('debug')('botfarm:bots:loader');
const error = require('debug')('botfarm:error:bots:loader');
const { queue } = require('db');

const findDueBots = async () => {
  const now = new Date();
  debug('Checking for due bots')
  const dueBots = await queue.search({ before: now });
  return dueBots;
}

const loadDueBots = async () => {
  const dueBots = await findDueBots();
  const dueBotsWithLoaders = dueBots.map(dueBot => {
    debug(dueBot);
  })
}

/**
 * Load specified bot from userfiles dir
 */

const loadBot = async path => {

}

module.exports = { loadBot, loadDueBots, findDueBots };