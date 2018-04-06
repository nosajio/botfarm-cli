const debug = require('debug')('botfarm:capture');
const error = require('debug')('botfarm:error:capture');
const path = require('path');
const { outputs } = require('db');

const capture = (output, repo_id, bot_name, repo_name, startTime) => {
  outputs.capture('stdout', output, repo_id, bot_name, repo_name, startTime);
}

const captureError = (error, repo_id, bot_name, repo_name, startTime) => {
  outputs.capture('stderr', error, repo_id, bot_name, repo_name, startTime);
}

const captureOutputStream = (botProcess, bot, startTime) => {
  if (botProcess.stdout) {
    botProcess
      .stdout
      .on('data', data => 
        capture(data.toString(), bot.repo_id, bot.bot_name, bot.repo_name, startTime)
      );
  }
  if (botProcess.stderr) {
    botProcess
      .stderr
      .on('data', data => 
        captureError(data.toString(), bot.repo_id, bot.bot_name, bot.repo_name, startTime)
      );
  }
}

module.exports = { captureOutputStream, capture, captureError }