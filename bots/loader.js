const debug = require('debug')('botfarm:bots:loader');
const error = require('debug')('botfarm:error:bots:loader');
const path = require('path');
const { queue } = require('db');
const { farmWithBotfile } = require('farms');
const { botPath, botPathAbs } = require('./bot-path');

const findDueBots = async () => {
  const now = new Date();
  const dueBots = await queue.search({ before: now });
  if (! dueBots.length) {
    return null;
  }
  const queuedBots = dueBots.map(q => queue.take(q.id));
  const flatten = bots => bots.map(b => b[0]);
  return await Promise.all(queuedBots).then(bots => flatten(bots));
}

/**
 * Return a 1 dimensional object of bot: botfile entries and return it
 * @param {Array<Object>} farmsAndBotfiles 
 */
const botsIndex = farmsAndBotfiles => {
  return farmsAndBotfiles.reduce((acc, current) => {
    Object.entries(current.botfile).forEach(([name, val]) => {
      acc[name] = val;
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
  if (! dueBots) {
    return null;
  }
  const openBotfiles = dueBots.map(dueBot => 
    farmWithBotfile(dueBot.farm_id)
  );
  const farms = await Promise.all(openBotfiles);
  const botfileBots = botsIndex(farms);
  const dueBotsWithLoaders = dueBots.map(dueBot => loadBot(dueBot, botfileBots, farms));
  return dueBotsWithLoaders;
}

/**
 * Load specified bot from userfiles dir
 * @param {object} bot
 * @param {object} botfileBots
 * @param {array} farms
 */
const loadBot = (bot, botfileBots, farms) => {
  const farm = farms.find(f => f.id = bot.farm_id);
  const botfileEntry = botfileBots[bot.bot_name];
  const loader = botfileEntry.load;
  const loaderPath = botPath(farm.slug, loader);
  const loaderPathFull = botPathAbs(farm.slug, loader);
  return Object.assign({}, bot, { loader: loaderPath, fullLoader: loaderPathFull, autorun: botfileEntry.autorun });
}

module.exports = { loadBot, loadDueBots, findDueBots };