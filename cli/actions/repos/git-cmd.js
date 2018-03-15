const debug = require('debug')('botfarm:cli:gitCmd');
const error = require('debug')('botfarm:error:cli:gitCmd');
const is = require('is_js');
const path = require('path');
const { exec } = require('child_process');

const reposPath = process.env.FARMS;
const repoPath = dir => path.resolve(process.mainModule.filename, '../..', reposPath, dir);

/**
 * Run a git command from inside of a bot repository. Pretty much all of the git
 * commands should go through this function.
 * @param {string} dir repository directory name
 * @param {string} gitOp the operation to run ie - add, commit, pull etc...
 * @param {string} args arguments to be passed after the command ie - "origin master"
 */
const gitCmd = (dir, gitOp, args) => new Promise(resolve => {
  if (is.not.string(gitOp)) {
    error('gitCmd expects gitOp to be string');
    return;
  }
  const absDirPath = repoPath(dir);
  const cd = `cd ${absDirPath}`;
  const git = `git ${gitOp} ${args}`;
  const execCommand = `${cd} && ${git}`;
  exec(execCommand, (err, stdout, stderr) => {
    debug(stdout, stderr);
    resolve();
  });
});

module.exports = gitCmd;