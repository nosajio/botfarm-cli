const { queue } = require('db');

/**
 * Functions for adding and removing items from the queue
 */

/**
 * Push an item into the queue
 * @param {object} item 
 * @param {string} item.bot_name
 * @param {Date}   item.time
 * @param {number} item.farm_id
 */
const push = ({ bot_name, time, farm_id }) => 
  queue.push({
    bot_name,
    time,
    farm_id
  });

module.exports = push