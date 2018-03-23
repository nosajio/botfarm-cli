require('dotenv').config();

const error = require('debug')('botfarm:error');
const debug = require('debug')('botfarm:boot');
const is = require('is_js');
const db = require('db');
const queue = require('queue');
const { runner } = require('bots');

// A simple delay 
const wait = seconds => new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, seconds * 1000);
});

const runloop = () => {  
  wait(5)
    .then(() => runner.runDueBots())
    .catch(err => error(err))
    // After running due bots, add their next runtimes to the queue
    .then(dueBots => is.not.empty(dueBots) && queue.updateForBots(dueBots))
    .catch(err => error(err))
    // Finally, re-start the runloop 
    .then(() => runloop())
    .catch(err => error(err));
}

const start = () => {
  // Always renew the queue on start 
  queue.renewQueue()
    .then(() => runloop())
    .catch(err => error(err) && stop());
}

const stop = () => {
  process.exit(0);
}

//  WHen the AUTOSTART env variable is present, run the start function
if (process.env.AUTOSTART) {
  start();
}

module.exports = {start, stop}
