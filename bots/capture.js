const debug = require('debug')('botfarm:capture');
const error = require('debug')('botfarm:error:capture');
const path = require('path');
const { outputs } = require('db');

const capture = (output, farm_id, bot_name) => {
  outputs.capture('stdout', output, farm_id, bot_name);
}

const captureError = (error, farm_id, bot_name) => {
  outputs.capture('stderr', error, farm_id, bot_name);
}

const captureOutputStream = (botProcess, bot) => {
  if (botProcess.stdout) {
    botProcess
      .stdout
      .on('data', data => 
        capture(data.toString(), bot.farm_id, bot.bot_name)
      );
  }
  if (botProcess.stderr) {
    botProcess
      .stderr
      .on('data', data => 
        captureError(data.toString(), bot.farm_id, bot.bot_name)
      );
  }
}

module.exports = { captureOutputStream, capture, captureError }