const path = require('path');
const { exec } = require('child_process');
const is = require('is_js');

const binFile = path.resolve(__dirname, '..', 'cli', 'bin.js');

// Only make the app return errors when running tests
let envStr = 'DEBUG=botfarm:error:*';

if (process.env.TESTING) {
  envStr += ' TESTING=true';
}

/**
 * Wrapper for testing of the the command line interface
 * @param {string} cmd the root command to be ran after "bots", like "service", "queue" etc
 * @param {string | string[]} args the args after the cmd. "start", "show", you get it
 */
function cliCmd(cmd, args='') {
  if (is.not.string(cmd)) {
    throw new TypeError('expects `cmd` argument to be string');
  }
  if (is.array(args)) {
    args = args.join(' ');
  }
  return new Promise(resolve => {
    const fullCommand = `${envStr} ${binFile} ${cmd} ${args}`;
    let exec_out, exec_err;
    const child = exec(fullCommand, (err, stdout, stderr) => {
      exec_out = stdout;
      exec_err = stderr;
    });
    child.stdout.on('end', () => resolve([exec_out, exec_err]));
  });
}

module.exports = cliCmd