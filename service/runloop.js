const error = require('debug')('botfarm:error:service');
const debug = require('debug')('botfarm:service:runloop');
const { sleep } = require('sleep');
const is = require('is_js');
const db = require('db');
const queue = require('queue');
const { runner } = require('bots');

// A simple delay using native C++ sleep 
const wait = async seconds => {
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
const sleepUntilNext = () => {
  // TODO: get next runtime
  runloop();
}

/**
 * Run through the due bots and run them after a delay
 * @param {Date} nextRuntime When should the runloop resume (seconds)
 */
const runloop = (nextRuntime = new Date()) => {
  const secsUntilNextRun = 5;
  // TODO: compute seconds until next bot is due
  wait(secsUntilNextRun)
    .then(() => runner.runDueBots())
    .catch(err => error(err))
    // After running due bots, add their next runtimes to the queue
    .then(ranBots => requeueBots(ranBots))
    .catch(err => error(err))
    // Finally, re-start the runloop 
    .then(() => sleepUntilNext())
    .catch(err => error(err));
}

module.exports = runloop