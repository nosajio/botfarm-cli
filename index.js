require('dotenv').config();

const error = require('debug')('botfarm:error');
const debug = require('debug')('botfarm:boot');

const start = require('service/start');

//  WHen the AUTOSTART env variable is present, run the start function
if (process.env.AUTOSTART) {
  start();
}