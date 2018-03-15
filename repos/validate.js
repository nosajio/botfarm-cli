const debug = require('debug')('botfile:repos:validate')
const error = require('debug')('botfile:error:repos:validate')
const path = require('path')
const fs = require('fs');

/**
 * Run a set of tests on a repo directory to decide whether or not its 
 * valid to be added.
 */
function validateRepo(repoName) {
  const reposDir = process.env.REPOS;
  const repoPath = path.resolve(__dirname, '..', reposDir);
  const repoFiles = fs.readdirSync(repoPath);
  const hasBotfile = checkBotfile(repoFiles);
  return { valid: hasBotfile, reason: ! hasBotfile ? 'No botfile present' : '' };
}

function checkBotfile(files) {
  const botfile = files.find(f => f === 'botfile.js');
  debug(botfile);
}
 
module.exports = validateRepo