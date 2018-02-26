const debug = require('debug')('botfarm:bots:fs');
const error = require('debug')('botfarm:error:bots:fs');
const fs = require('fs');
const path = require('path');

const { USERDATA } = process.env;
const userdataPath = path.resolve(`${__dirname}/../${USERDATA}`);

/**! 
 *  Return all bots in .userdata as an object 
 * 
 *  @return {object} bots - example:
 *    { 
 *      'dirname': ['filename.ext', ...], 
 *      ...  
 *    }
 */
const allBotPaths = () => {
  const botfarms = fs.readdirSync(userdataPath, 'utf8');
  const botfarmPaths = botfarms.map(dir => ([`${userdataPath}/${dir}`, dir]));
  return botfarmPaths;
};


/**
 *  Open all botfiles and return them as a single array 
 */
const allBotfiles = () => {
  const botfiles = {};
  allBotPaths().forEach(([botpath, botDir]) => {
    try {
      const loadedBotfile = require(`${botpath}/botfile.js`);
      botfiles[botDir] = loadedBotfile();
    } catch(err) {
      throw new Error(err);
    }
  });
  debug(botfiles);
  return botfiles;
};

module.exports = { allBotPaths, allBotfiles }