require('dotenv').config();

const error = require('debug')('botfarm:error');
const debug = require('debug')('botfarm:boot');
const db = require('db');
const { runner } = require('bots');

const runEvery = seconds => new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, seconds * 1000);
});

const runloop = () => {
  //  Check for bots that need to be run
  runEvery(12)
    .then(() => runner.runDueBots())
    .catch(err => error(err))
    // Finally, re-start the runloop 
    .then(() => runloop())
    .catch(err => error(err));
}

const boot = () => {
  runloop();
}

boot();
