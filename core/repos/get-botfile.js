const debug = require('debug')('botfarm:botfiles:get');
const path = require('path');
const paths = require('paths');

const reposDir = paths.repos;

// TODO: check if botfile is usable here before returning it. Could probs use the 
// validation helper for this

const getBotfile = repoDir => {
  const botfilePath = path.join(reposDir, repoDir, 'botfile.js');
  try {
    const requestedBotfile = require(botfilePath);
    return requestedBotfile;
  } catch(err) {
    throw err;
  }
}

module.exports = getBotfile;