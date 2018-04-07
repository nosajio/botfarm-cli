const error = require('debug')('botfarm:error:service');
const debug = require('debug')('botfarm:service');
const queue = require('queue');
const runloop = require('./runloop');
const stop = require('./stop');

const start = () => {
  // Always renew the queue on start 
  return queue.renewQueue()
    .then(() => runloop())
    .catch(err => error(err) && stop());
}

module.exports = start;