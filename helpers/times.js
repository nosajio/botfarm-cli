const debug = require('debug')('botfarm:helpers:times');
const is = require('is_js');
const datefns = require('date-fns');

/**
 * 
 * @param {number} timestamp 
 */
function timeString(timestamp) {
  const date = new Date(timestamp);
  return datefns.format(date, 'HH:mm:ss');
}

/**
 * 
 * @param {number} timestamp 
 * @param {boolean} shorten 
 */
function dueInString(timestamp, shorten = false) {
  const dueDate = new Date(timestamp);
  const now = new Date();
  let distance = datefns.distanceInWords(dueDate, now);
  if (shorten) {
    distance = distance.replace('about ', '');
    distance = distance.replace('less than a', '< 1');
    distance = distance.replace('minute', 'min');
    distance = distance.replace('hour', 'hr');
    distance = distance.replace('second', 'sec');
  }
  return now > dueDate ? `${distance} ago` : distance;
}

/**
 * 
 * @param {number|string} ms 
 * @returns {string}
 */
const friendlyRuntime = ms => {
  ms = parseInt(ms);
  if (is.nan(ms)) {
    throw TypeError('argument is not a number');
  }
  return ms >= 1000 ? `${(ms/1000).toFixed(2)}s` : `${ms}ms`;
}

module.exports = { dueInString, timeString, friendlyRuntime }