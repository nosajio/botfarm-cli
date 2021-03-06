const debug = require('debug')('botfarm:cli:addAction');
const error = require('debug')('botfarm:error:cli:addAction');
const is = require('is_js');
const path = require('path');
const { create } = require('core/repos');

/**
 * Add a repositiry and create reference in the database
 */
async function addRepo(url, dir) {
  if (is.not.string(url) || is.not.string(dir)) {
    throw new TypeError('url and dir arguments must be strings');
  }
  try {
    const [created, stdout, stderr] = await create(url, dir);
    if (! created) {
      throw new Error(stderr);
    }
  } catch(err) {
    throw err;
  }
}

module.exports = addRepo;