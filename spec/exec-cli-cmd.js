const path = require('path');
const { exec } = require('child_process');
const is = require('is_js');

const binFile = path.resolve(__dirname, '..', 'cli', 'bin.js');

/**
 * Wrapper for testing of the the command line interface
 * @param {string} cmd the root command to be ran after "bot", like "service", "queue" etc
 * @param {string} args the args after the cmd. "start", "show", you get it
 */
function cliCmd(cmd, args='') {
  if (is.not.string(cmd)) {
    throw new TypeError('expects `cmd` argument to be string');
  }
  return new Promise(resolve => {
    const fullCommand = `${binFile} ${cmd} ${args}`;
    exec(fullCommand, (err, stdout, stderr) => {
      resolve([stdout, stderr]);
    });
  })
}

module.exports = cliCmd