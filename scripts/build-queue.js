const path = require('path');
require('dotenv').config();

const debug = require('debug')('botfarm:scripts');
const renewQueue = require('botfiles/renewQueue');

(async () => {
  try {
    await renewQueue();
    debug('Built queue from botfile data. exiting...');
    process.exit();
  } catch(err) {
    throw err;
  }
})();