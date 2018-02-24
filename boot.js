const error = require('debug')('botfarm:error');
const debug = require('debug')('botfarm:boot');

const runEvery = seconds => new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, seconds * 1000);
});

const boot = () => {
  //  Check for bots that need to be run
  //  Resolution: 1 sec
  runEvery(1)
    .then(() => {
      debug('Check for bots to be run');
      boot();
    })
    .catch(err => error(err));
}

boot();

