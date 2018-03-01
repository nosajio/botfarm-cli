const path = require('path');
require('dotenv').config();

const debug = require('debug')('botfarm:scripts');
const db = require('db');
const constructQueueFromBotfiles = require('botfiles/constructQueueFromBotfiles');

(async () => {
  try {
    await db.connect();
    await constructQueueFromBotfiles();
    debug('Built queue from botfile data. exiting...');
    process.exit();
  } catch(err) {
    throw err;
  }
})();