const debug = require('debug')('botfarm:repos:remove');
const error = require('debug')('botfarm:error:repos:remove');
const { exec } = require('child_process');
const path = require('path');
const is = require('is_js');
const { repos: { getByDir, deleteByDir } } = require('core/db');
const { repoPath } = require('./repo-path');
const appPaths = require('paths');

/**
 * Remove repo dir and the database reference
 * @param {string} dirName
 */
function removeRepo(dirName) {
  return new Promise(resolve => {
    if (is.not.string(dirName)) {
      throw new TypeError('dirName is expected to be a string');
    }
    getByDir(dirName).then(repo => {
      if (!repo) {
        return Promise.reject('Hmm. That repo doesn\'t exist. Run "bots repos list" to check if the directory name is correct.');
      }
      const absPath = repoPath(dirName);

      // Make sure the path is within the .botfarm dir to prevent accidentally 
      // deleting the entire hard drive
      const isBotfarmDir = absPath.includes(appPaths.repos);
      if (!isBotfarmDir) {
        throw new Error('Tried to delete an unsafe directory');
      }

      // Careful now
      exec(`rm -r ${absPath}`, (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        if (stderr) {
          throw new Error(stderr);
        }
        // If the dir is removed, delete the reference in the db
        deleteByDir(dirName).then(() => resolve(repo));
      });
    });
  });
}

module.exports = removeRepo;