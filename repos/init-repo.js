const debug = require('debug')('botfarm:repos:init');
const error = require('debug')('botfarm:error:repos:init');
const is = require('is_js');
const runInRepo = require('./run-in-repo');
const profileRepo = require('./profile');

/**
 * Used for configuring a new or existing project by running commands like 
 * 'npm install' for note projects
 * @param {string} dir repository directory name
 * @returns {Promise<>}
 */
const initRepo = async dir => {
  const cmds = [];
  const repoStats = await profileRepo(dir);
  if (repoStats.nodeProject) {
    cmds.push('npm install');
  }

  // Nothing to be run means there's nothing to be done; return...
  if (is.empty(cmds)) {
    return null;
  }

  await runInRepo(dir, cmds);
  return;
}

module.exports = initRepo