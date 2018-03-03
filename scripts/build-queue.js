const path = require('path');
require('dotenv').config();

const debug = require('debug')('botfarm:scripts');
const constructQueueFromBotfiles = require('botfiles/constructQueueFromBotfiles');

(async () => {
  try {
    await constructQueueFromBotfiles();
    debug('Built queue from botfile data. exiting...');
    process.exit();
  } catch(err) {
    throw err;
  }
})();