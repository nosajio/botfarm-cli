const queueTable = require('db').queue;

/**
 * Functions for adding and removing items from the queue
 */

/**
 * Push an item into the queue
 * @param {object} item 
 * @param {number} item.farmId
 * @param {string} item.botName
 * @param {Date}   item.time
 */
const push = ({ farmId, botName, time }) => {
  queueTable.push({
    bot_name: botName,
    farmId,
    time
  });
}

module.exports = push