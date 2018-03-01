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
 * @param {string}  bots.[botname].autorun
 */
const pushMany = async bots => {
  if (is.not.object(bots)) {
    throw new TypeError('bots arg is not an Object');
  }
  const pushOps = Object
    .entries(bots)
    .map(
      ([botName, botProps]) => push({ farmId: 0, botName, time: botProps.runTimes[0] })
    );
  const results = await Promise.all(pushOps);
}

module.exports = pushMany