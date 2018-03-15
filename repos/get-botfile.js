const debug = require('debug')('botfarm:botfiles:get');
const path = require('path');

const reposDir = process.env.REPOS;

// TODO: check if botfile is usable here before returning it. Could probs use the 
// validation helper for this

const getBotfile = repoDir => {
  const botfilePath = path.resolve(__dirname, '..', reposDir, repoDir, 'botfile.js');
  try {
    const requestedBotfile = require(botfilePath);
    return requestedBotfile;
  } catch(err) {
    throw err;
  }
}

module.exports = getBotfile;