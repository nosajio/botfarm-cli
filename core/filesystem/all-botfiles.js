const debug = require('debug')('botfarm:bots:fs');
const error = require('debug')('botfarm:error:bots:fs');
const allBotPaths = require('./all-bot-paths');

/**
 *  Open all botfiles and return them as a single array 
 */
const allBotfiles = () => {
  const botfiles = {};
  allBotPaths().forEach(([botpath, botDir]) => {
    try {
      const loadedBotfile = require(`${botpath}/botfile.js`);
      botfiles[botDir] = loadedBotfile();
    } catch (err) {
      throw new Error(err);
    }
  });
  return botfiles;
};

module.exports = allBotfiles;