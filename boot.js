require('dotenv').config();

const error = require('debug')('botfarm:error');
const debug = require('debug')('botfarm:boot');
const db = require('db');
const queue = require('queue');
const { runner } = require('bots');

// A simple iterative 
const runEvery = seconds => new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, seconds * 1000);
});

const runloop = () => {  
  runEvery(5)
    .then(() => runner.runDueBots())
    .catch(err => error(err))
    // After running due bots, add their next runtimes to the queue
    .then(dueBots => queue.updateForBots(dueBots))
    .catch(err => error(err))
    // Finally, re-start the runloop 
    .then(() => runloop())
    .catch(err => error(err));
}

const boot = () => {
  runloop();
}

boot();
