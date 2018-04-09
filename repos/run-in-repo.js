const debug = require('debug')('botfarm:repos:cmd');
const error = require('debug')('botfarm:error:repos:cmd');
const is = require('is_js');
const path = require('path');
const paths = require('paths');
const { exec } = require('child_process');
const { repoPath } = require('./repo-path');

const reposPath = paths.repos;

/**
 * cd's into a directory, then executes the passed command(s). Useful for 
 * updating and configuring different repos.
 * @param {string} dir 
 * @param {string|string[]} commands one or many commands to run in the dir
 * @returns {Promise<>}
 */
const runCommandsInDir = (dir, commands) => new Promise(resolve => {
  if (is.not.string(dir)) {
    error('initRepo expects dir argument to be string');
    return;
  }
  // Make sure the path is within the .botfarm/.repos dir to prevent accidentally 
  // deleting the entire hard drive
  const absDirPath = repoPath(dir);
  const isBotfarmDir = absDirPath.includes(reposPath);
  if (!isBotfarmDir) {
    throw new Error('Tried to run command in an unsafe directory');
  }
  const cd = `cd ${absDirPath}`;
  const cmdStr = is.array(commands) ? commands.join(' && ') : commands;
  const fullCmd = `${cd} && ${cmdStr}`;
  debug('$ %s', fullCmd);
  exec(fullCmd, (err, stdout, stderr) => {
    if (err) {
      throw err;
    }
    resolve([stdout, stderr]);
  });
});

module.exports = runCommandsInDir