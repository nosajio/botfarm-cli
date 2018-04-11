const debug = require('debug')('botfarm:cli:removeAction');
const error = require('debug')('botfarm:error:cli:removeAction');
const { remove } = require('core/repos');

/**
 * Remove repo dir and the database reference
 * @param {string} dirName
 */
async function removeAction(dirName) {
  return await remove(dirName);
}

module.exports = removeAction;