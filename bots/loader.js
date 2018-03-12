const debug = require('debug')('botfarm:bots:loader');
const error = require('debug')('botfarm:error:bots:loader');
const path = require('path');
const { queue } = require('db');
const { farmWithBotfile } = require('farms');
const { botPath, botPathAbs } = require('./bot-path');

const findDueBots = async () => {
  const now = new Date();
  const dueBots = await queue.search({ before: now });
  return dueBots;
}

const loadersIndex = farmsAndBotfiles => {
  return farmsAndBotfiles.reduce((acc, current) => {
    Object.entries(current.botfile).forEach(([name, val]) => {
      acc[name] = val.load;
    });
    return acc;
  }, {});
}

/**
 * Get due bots from the queue with loaders inline
 * @return {Array.<Object>} dueBotsWithLoaders
 */
const loadDueBots = async () => {
  const dueBots = await findDueBots();
  const openBotfiles = dueBots.map(dueBot => 
    farmWithBotfile(dueBot.farm_id)
  );
  const farms = await Promise.all(openBotfiles);
  const loaders = loadersIndex(farms);
  const dueBotsWithLoaders = dueBots.map(dueBot => {
    const farm = farms.find(f => f.id = dueBot.farm_id);
    const loaderPath = botPath(farm.slug, loaders[dueBot.bot_name]);
    const loaderPathFull = botPathAbs(farm.slug, loaders[dueBot.bot_name]);
    return Object.assign({}, dueBot, { loader: loaderPath, fullLoader: loaderPathFull });
  });
  return dueBotsWithLoaders;
}

/**
 * Load specified bot from userfiles dir
 */

const loadBot = async path => {

}

module.exports = { loadBot, loadDueBots, findDueBots };