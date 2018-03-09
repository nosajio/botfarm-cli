const debug = require('debug')('botfarm:botfiles:get');
const path = require('path');

const farmsDir = process.env.FARMS;

const getBotfile = farmSlug => {
  const botfilePath = path.resolve(__dirname, '..', farmsDir, farmSlug, 'botfile.js');
  try {
    const requestedBotfile = require(botfilePath);
    return requestedBotfile;
  } catch(err) {
    throw err;
  }
}

module.exports = getBotfile;