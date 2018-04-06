const debug = require('debug')('botfarm:bots:queue:pushMany');
const is = require('is_js');
const push = require('./push');

/**
 * Functions for adding and removing items from the queue
 */

/**
 * Push a bots object into the queue
 * @param {object} bots 
 * @param {string} bots.[botname].file
 * @param {array} bots.[botname].runTimes
 * @param {string} bots.[botname].autorun
 * @param {number} repoId
 * @param {string} repoName
 */
const pushMany = async (bots, repoId, repoName) => {
  if (is.not.object(bots)) throw new TypeError('bots arg is not an Object');
  if (is.not.number(repoId)) throw new TypeError('pushMany expects repoId to be number');
  if (is.not.string(repoName)) throw new TypeError('pushMany expects repoName to be string');

  const pushOps = Object
    .entries(bots)
    .map(
      ([bot_name, botProps]) => push({ repo_id: repoId, bot_name, repo_name: repoName, time: botProps.runTimes[0] })
    );
    
  const results = await Promise.all(pushOps);
  return results;
}

module.exports = pushMany