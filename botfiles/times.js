const debug = require('debug')('botfarm:botfile:times')
const error = require('debug')('botfarm:error:botfile:times')
const datefns = require('date-fns');
const is = require('is_js');

/**!
 * Tools for parsing botfiles
 */

const patterns = {
  // 10 minutes, 6 hours...
  minsHrs: /^([0-5]*[0-9]) ?(minute|hour)/,
  // 6am, 10:20pm, ...
  exact: /^([0-1]?[0-9]):?([0-5][0-9])?(am?|pm?)/,
  // :30, :01...
  wildcard: /^:([0-5]?[0-9])/
}

/**
 * Next occurance of the passed time. Will return full date that's one day ahead
 * if the time has already passed today.
 * 
 * @param {number} HH Hours
 * @param {number} MM Minutes
 * @returns {Date} 
 */
const nextOccurance = (HH, MM) => {
  if (is.not.number(HH)) {
    error('HH must be number: %s', typeof HH);
    return null;
  }
  const now = new Date();
  const currentHH = now.getHours();
  const today = HH > currentHH;
  const jump = today ? HH - currentHH : HH - currentHH + 24;
  let correctTime = datefns.addHours(now, jump);
  if (is.number(MM)) {
    correctTime = datefns.setMinutes(correctTime, MM);
  }
  correctTime = datefns.setSeconds(correctTime, 0);
  return correctTime;
}


/**
 * Parse mins/hrs pattern
 * 
 * @param {string} str Time string, like: 1 hour, 30 minutes etc
 */
const parseMinsHrs = str => {
  const parsed = str.match(patterns.minsHrs);
  const value = parseInt(parsed[1]);
  const hours = parsed[2] === 'hour';
  const now = new Date();
  if (hours) {
    return datefns.addHours(now, value);
  }
  return datefns.addMinutes(now, value);
}


/**
 * Parse exact time pattern. NOTE that the time must include either am or pm 
 * appended to it tp be valid
 * 
 * @param {string} str Time string, like: 1:30pm, 11am, etc
 */
const parseExact = str => {
  const parsed = str.match(patterns.exact);
  const ampm = parsed[3];
  const hours = ampm === 'am' ? parseInt(parsed[1]) : parseInt(parsed[1]) + 12; // Add 12 hours for PM times
  const minutes = parsed[2] ? parseInt(parsed[2]) : 0;
  const nextTime = nextOccurance(hours, minutes);
  return nextTime;
}


/**
 * Parse wildcard pattern
 * 
 * @param {string} str Time string, like: :00, :45, etc
 */
const parseWildcard = str => {
  const parsed = str.match(patterns.wildcard);
  const minutes = parseInt(parsed[1]);
  const now = new Date();
  let nextTime;
  // When the next :n past the hour is before the current minute, return the
  // next hour.
  if (minutes > now.getMinutes()) {
    nextTime = datefns.setMinutes(now, minutes);
  } else {
    nextHour = datefns.addHours(now, 1);
    nextTime = datefns.setMinutes(nextHour, minutes);
  }
  // Zero seconds
  nextTime = datefns.setSeconds(nextTime, 0);
  return nextTime
}
 

/**
 * Take a autorun string and return a valid JS Date.
 * @param {string} autorunStr
 * 
 * Examples of valid autorun strings
 *   :15             Every quarter past 
 *   10 minutes      Every 10 minutes
 *   1 hour, :10     Every 1 hour and 10 past
 *   9pm, 6:50am     Specific times
 *   12am, 6 hours   Every day at 12am, and every 6 hours       
 */
const parseRunTime = autorunStr => {
  const parsedTimes = [];
  const commands = autorunStr.replace(/, /g, ',').split(',');
  commands.forEach(c => {
    // 1 hour, 10 minutes, etc
    if (patterns.minsHrs.test(c)) {
      parsedTimes.push( parseMinsHrs(c) );
    } else

    if (patterns.exact.test(c)) {
      parsedTimes.push( parseExact(c) );
    } else

    if (patterns.wildcard.test(c)) {
      parsedTimes.push( parseWildcard(c) );
    } else {
      error('Unable to parse time: %s', c);
    }
  });
  return parsedTimes;
}
 

/**
 * Calculate the next run times for all bots in the botfile
 * 
 * @param {object} bots - valid botfile 
 */
const nextRunTimes = bots => {
  const botsWithRunTimes = {};
  Object.entries(bots).forEach(([bot_name, props]) => {
    const runTimes = parseRunTime(props.autorun);
    const botWithTime = {
      [bot_name]: { ...props, runTimes: runTimes.sort( datefns.compareAsc ) } 
    }
    Object.assign(botsWithRunTimes, botWithTime);
  });
  return botsWithRunTimes;
}
 

module.exports = { nextRunTimes, parseRunTime }