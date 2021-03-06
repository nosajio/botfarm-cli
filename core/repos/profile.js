const debug = require('debug')('botfarm:repos:profile');
const error = require('debug')('botfarm:error:repos:profile');
const fs = require('fs');
const path = require('path');
const paths = require('paths');
const { repoPath } = require('./repo-path');

/**
 * List all files in repo dir
 * @param {string} dir Name of repo dir relatinve to .repos
 * @returns {Promise<string[]>}
 */
const repoDirList = dir => new Promise(resolve => {
  const ignoredFiles = ['.git', '.gitignore', '.DS_Store'];

  // When the passed dir isn't already an abs path, make it one with repoPath 
  const alreadyAbs = dir[0] === '/';
  const absPath = alreadyAbs ? dir : repoPath(dir);

  fs.readdir(absPath, 'utf8', (err, files) => {
    if (err) {
      throw err;
    }
    const sansIgnored = files.filter(f => ! ignoredFiles.includes(f));
    resolve(sansIgnored);
  })
});

/**
 * Check if the project contains a package file
 * @param {string[]} dirList 
 * @returns {boolean}
 */
const isNodeProject = dirList => dirList.includes('package.json');

/**
 * Check if the project has a botfile
 * @param {string} dirList 
 */
const hasBotfile = dirList => dirList.includes('botfile.js');

/**
 * Examines a repo and returns information about it. Things like project type,
 * file count etc
 * @param {string} dir the repo dir relative to .repos
 */
const profileRepo = async dir => {
  const dirList = await repoDirList(dir);
  const isNode = isNodeProject(dirList);
  return {
    nodeProject: isNode,
    hasBotfile: hasBotfile(dirList),
    files: {
      count: dirList.length,
      list: dirList,
    },
  };
}


module.exports = profileRepo