const debug = require('debug')('botfarm:helpers:times');
const datefns = require('date-fns');

function timeString(timestamp) {
  const date = new Date(timestamp);
  return datefns.format(date, 'HH:mm:ss');
}

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

module.exports = { dueInString, timeString }