const debug = require('debug')('botfarm:cli:gitCmd');
const error = require('debug')('botfarm:error:cli:gitCmd');
const runCmd = require('./run-in-repo');
const is = require('is_js');

/**
 * Run a git command from inside of a bot repository. Pretty much all of the git
 * commands should go through this function.
 * @param {string} dir repository directory name
 * @param {string} gitOp the operation to run ie - add, commit, pull etc...
 * @param {string} args arguments to be passed after the command ie - "origin master"
 */
const gitCmd = async (dir, gitOp, args) => {
  if (is.not.string(gitOp)) {
    error('gitCmd expects gitOp to be string');
    return;
  }
  const git = `git ${gitOp} ${args}`;
  return await runCmd(dir, git);
}

module.exports = gitCmd;