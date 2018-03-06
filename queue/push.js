const { queue } = require('db');

/**
 * Functions for adding and removing items from the queue
 */

/**
 * Push an item into the queue
 * @param {object} item 
 * @param {string} item.botName
 * @param {Date}   item.time
 */
const push = ({ botName, time }) => 
  queue.push({
    bot_name: botName,
    time
  });

module.exports = push