const debug = require('debug')('botfarm:helpers:times');
const datefns = require('date-fns');

function dueInString(timestamp) {
  const dueDate = new Date(timestamp);
  const now = new Date();
  const distance = datefns.distanceInWords(dueDate, now);
  return now > dueDate ? `${distance} ago` : distance;
}

module.exports = { dueInString }