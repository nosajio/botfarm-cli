const debug = require('debug')('botfarm:bots:loader');
const error = require('debug')('botfarm:error:bots:loader');
const path = require('path');
const is = require('is_js');
const { queue, repos } = require('db');
const { repoWithBotfile, getBotfile } = require('repos');
const { botPath } = require('./bot-path');


/**
 * Output a common shaped object that holds all the data needed to load and 
 * run a bot.
 * @param {string} repoDir Directory name containing the repo
 * @param {number} repoId 
 * @param {string} botName Name of the bot in the botfile
 * @param {string} load Load entry from the botfil
 * @param {string} autorun Autorun entry from the botfile
 * @returns {object}
 */
const botShape = (repoDir, repoId, repoName, botName, load, autorun) =>  {
  const loadPath = botPath(repoDir, load);
  return {
    loader: loadPath,
    repo_id: repoId,
    repo_dir: repoDir,
    bot_name: botName,
    repo_name: repoName,
    autorun,
  }
}

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
 * Return a 1 dimensional object of all bot: botfile entries
 * @param {Array<Object>} reposAndBotfiles 
 */
const botsIndex = reposAndBotfiles => {
  return reposAndBotfiles.reduce((acc, current) => {
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
    repoWithBotfile(dueBot.repo_id)
  );
  const repos = await Promise.all(openBotfiles);
  const botfileBots = botsIndex(repos);
  const dueBotsWithLoaders = dueBots.map(dueBot => prepareDueBot(dueBot, botfileBots, repos));
  return dueBotsWithLoaders;
}

/**
 * Load specified bot from userfiles dir
 * @param {object} bot
 * @param {object} botfileBots
 * @param {array} repos
 */
const prepareDueBot = (bot, botfileBots, repos) => {
  const repo = repos.find(f => f.id = bot.repo_id);
  const botfileEntry = botfileBots[bot.bot_name];
  const loader = botfileEntry.load;
  const preparedBot = botShape(repo.dir, repo.id, repo.name, bot.bot_name, loader, botfileEntry.autorun);
  return preparedBot;
}


/**
 * Find the repo and containing botfile, then if <botName> exists, return the 
 * botfile entry for the bot.
 * @param {string} repoName 
 * @param {string} botName 
 * @return {object} botfileEntry
 */
const loadBot = async (repoName, botName) => {
  const repo = await repos.getByDir(repoName);
  if (is.not.object(repo)) {
    return Promise.reject('Repository doesn\'t exist.');
  }
  const botfile = await getBotfile(repoName);
  if (is.empty(botfile)) {
    return Promise.reject('Bot cannot be found in that repo.');
  }
  const bot = botfile()[botName];
  if (! bot) {
    return Promise.reject(`That bot cannot be found in the botfile in repo ${repoName}.`);
  }
  const botObject = botShape(repoName, repo.id, botName, bot.load, bot.autorun);
  return botObject;
}


module.exports = { loadBot, loadDueBots, findDueBots };