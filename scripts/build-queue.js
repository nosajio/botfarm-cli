const path = require('path');

const debug = require('debug')('botfarm:scripts');
const renewQueue = require('core/queue/renewQueue');

(async () => {
  try {
    await renewQueue();
    debug('Built queue from botfile data. exiting...');
    process.exit();
  } catch(err) {
    throw err;
  }
})();