const error = require('debug')('botfarm:error:service');
const debug = require('debug')('botfarm:service:runloop');
const { sleep } = require('sleep');
const is = require('is_js');
const db = require('db');
const queue = require('queue');
const datefns = require('date-fns');
const { runner } = require('bots');

// A simple delay using native C++ sleep 
const wait = async seconds => {
  debug('💤  Sleeping for %s seconds', seconds);
  sleep(seconds);
  return;
};

// Re-add passed bots to the queue
const requeueBots = ranBots => {
  if (is.empty(ranBots)) {
    return;
  }
  return queue.updateForBots(ranBots);
}

/**
 * Get next due bot's runtime from the head of the queue and use it to 
 * calculate how long the service should sleep until its next needed.
 */
const nextRun = async () => {
  const queueItems = await db.queue.get();
  // When the queue is empty, check again in 60 seconds
  if (is.empty(queueItems)) {
    const timeIn60s = datefns(new Date()).addMinutes(1);
    return timeIn60s;
  }
  const nextRunTime = new Date(queueItems[0].time);
  return nextRunTime;
}

/**
 * Calculate how many seconds are between now and a future date
 * @param {Date} date 
 * @returns {number} Seconds until the date
 */
const secsUntilDate = date => {
  const nowMs = datefns.getTime( new Date() );
  const thenMs = datefns.getTime(date);
  const deltaMs = thenMs - nowMs;
  if (deltaMs < 0) {
    return 0;
  }
  const secondsUntil = Math.ceil(deltaMs / 1000);
  return secondsUntil;
}

/**
 * Run through the due bots and run them after a delay
 */
const runloop = async () => {
  const nextRunTime = await nextRun();
  const secsUntilNextRun = secsUntilDate(nextRunTime) || 5;
  wait(secsUntilNextRun)
    .then(() => runner.runDueBots())
    .catch(err => error(err))
    // After running due bots, add their next runtimes to the queue
    .then(ranBots => requeueBots(ranBots))
    .catch(err => error(err))
    // Finally, re-start the runloop 
    .then(() => runloop())
    .catch(err => error(err));
}

module.exports = runloop