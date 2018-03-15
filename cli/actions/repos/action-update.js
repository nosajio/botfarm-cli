const debug = require('debug')('botfarm:cli:updateAction');
const error = require('debug')('botfarm:error:cli:updateAction');
const is = require('is_js');
const path = require('path');
const { reposWithBotfiles } = require('repos');
const gitCmd = require('./git-cmd');

const reposPath = process.env.REPOS;
const repoPath = dir => path.resolve(process.mainModule.filename, '../..', reposPath, dir);

/**
 * Update all the repositories
 */
async function updateRepos() {
  const allRepos = await reposWithBotfiles();
  const updateOps = allRepos.map(repo => updateRepo(repo.dir));
  return Promise.all(updateOps);
}

/**
 * Update a single repository
 * @param {string} dirName - the name of the directory in .userfiles
 */
async function updateRepo(dirName) {
  if (is.not.string(dirName)) {
    return Promise.reject('Expects dirName to be string');
  }
  await gitCmd(dirName, 'pull', 'origin master');
  return true;
}

module.exports = { updateRepo, updateRepos }