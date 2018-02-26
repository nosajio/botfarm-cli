require('dotenv').config();

const error = require('debug')('botfarm:error');
const debug = require('debug')('botfarm:boot');
const constructQueueFromBotfiles = require('bootstrap/constructQueueFromBotfiles');
const { connect } = require('db');

const runEvery = seconds => new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, seconds * 1000);
});

const runloop = () => {
  //  Check for bots that need to be run
  //  Resolution: 1 sec
  runEvery(60)
    .then(() => {
      debug('Check for bots to be run');
    })
    .catch(err => error(err))
    // Finally, re-start the runloop 
    .then(() => runloop());
}

const boot = () => {
  constructQueueFromBotfiles();
  runloop();
}

connect().then(() => boot());
