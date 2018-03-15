const error = require('debug')('botfarm:error:cli:service');
const daemon = require('../daemon');

module.exports = serviceActions;

function serviceActions(cmd, opts) {
  if (cmd === 'start') {
    try {
      console.log('🤖  Starting botfarm daemon...');
      daemon.start();
      process.exit();
    } catch (err) {
      console.log(err);
    }
  } else
  if (cmd === 'stop') {
    try {
      const status = daemon.stop();
      console.log('🛑  Botfarm daemon has stopped');
      process.exit();
    } catch (err) {
      console.log('Botfarm daemon isn\'t running or has encountered an error');
      error(err);
    }
  } else
  if (cmd === 'status') {
    try {
      const status = daemon.status();
      console.log(status);
      process.exit();
    } catch (err) {
      console.log('Botfarm daemon isn\'t running or has encountered an error');
      error(err);
    }
  }
}