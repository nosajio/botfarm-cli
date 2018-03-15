const { queue } = require('db');

/**
 * Functions for adding and removing items from the queue
 */

/**
 * Push an item into the queue
 * @param {object} item 
 * @param {string} item.bot_name
 * @param {Date}   item.time
 * @param {number} item.repo_id
 */
const push = ({ bot_name, time, repo_id }) => 
  queue.push({
    bot_name,
    time,
    repo_id
  });

module.exports = push