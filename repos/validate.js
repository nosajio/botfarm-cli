const debug = require('debug')('botfile:repos:validate')
const error = require('debug')('botfile:error:repos:validate')
const path = require('path')
const paths = require('paths')
const fs = require('fs');

/**
 * Run a set of tests on a repo directory to decide whether or not its 
 * valid to be added.
 */
function validateRepo(repoName) {
  const reposDir = paths.repos;
  const repoFiles = fs.readdirSync(reposDir);
  const hasBotfile = checkBotfile(repoFiles);
  return { valid: hasBotfile, reason: ! hasBotfile ? 'No botfile present' : '' };
}

function checkBotfile(files) {
  const botfile = files.find(f => f === 'botfile.js');
  debug(botfile);
}
 
module.exports = validateRepo