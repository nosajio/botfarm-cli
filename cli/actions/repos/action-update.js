const debug = require('debug')('botfarm:cli:updateAction');
const error = require('debug')('botfarm:error:cli:updateAction');
const { update: { updateOne, updateAll } } = require('repos');


/**
 * Update all the repositories
 */
async function updateRepos() {
  return await updateAll()
}

/**
 * Update a single repository
 * @param {string} dirName - the name of the directory in .userfiles
 */
async function updateRepo(dirName) {
  return await updateOne(dirName);
}

module.exports = { updateRepo, updateRepos }