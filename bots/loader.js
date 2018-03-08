const debug = require('debug')('botfarm:bots:loader');
const error = require('debug')('botfarm:error:bots:loader');
const path = require('path');
const { queue } = require('db');

const farmsPath = process.env.FARMS;

const primeBotLoader = path => () => require(path);

const findDueBots = async () => {
  const now = new Date();
  const dueBots = await queue.search({ before: now });
  return dueBots;
}

const loadDueBots = async () => {
  const dueBots = await findDueBots();
  const dueBotsWithLoaders = dueBots.map(dueBot => 
    Object.assign(
      {},
      dueBot, 
      { 
        loader: primeBotLoader(path.resolve(__dirname, '../', farmsPath, 'botfarm-test-bots', dueBot.bot_name)) 
      }
    )
  );
  return dueBotsWithLoaders;
}

/**
 * Load specified bot from userfiles dir
 */

const loadBot = async path => {

}

module.exports = { loadBot, loadDueBots, findDueBots };