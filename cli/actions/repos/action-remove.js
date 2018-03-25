const debug = require('debug')('botfarm:cli:removeAction');
const error = require('debug')('botfarm:error:cli:removeAction');
const { exec } = require('child_process');
const path = require('path');
const is = require('is_js');
const { repos: { getByDir, deleteByDir } } = require('db');

const reposPath = process.env.REPOS;

const repoPath = dir => path.resolve(process.mainModule.filename, '../..', reposPath, dir);

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
      if (! repo) {
        return Promise.reject('Hmm. That repo doesn\'t exist. Run "bots repos list" to check if the directory name is correct.');
      }
      const absPath = repoPath(dirName);
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