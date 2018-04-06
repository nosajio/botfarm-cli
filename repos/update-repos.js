const debug = require('debug')('botfarm:repos:update');
const error = require('debug')('botfarm:error:repos:update');
const is = require('is_js');
const path = require('path');
const { reposWithBotfiles } = require('repos');
const gitCmd = require('./git-cmd');


/**
 * Update all the repositories
 */
async function updateAll() {
  const allRepos = await reposWithBotfiles();
  const updateOps = allRepos.map(repo => updateOne(repo.dir));
  return Promise.all(updateOps);
}

/**
 * Update a single repository
 * @param {string} dirName - the name of the directory in .userfiles
 */
async function updateOne(dirName) {
  if (is.not.string(dirName)) {
    return Promise.reject('Expects dirName to be string');
  }
  await gitCmd(dirName, 'pull', 'origin master');
  return true;
}

module.exports = { updateOne, updateAll }