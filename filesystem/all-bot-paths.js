const debug = require('debug')('botfarm:bots:fs');
const error = require('debug')('botfarm:error:bots:fs');
const fs = require('fs');
const path = require('path');

const { USERDATA } = process.env;
const userdataPath = path.resolve(`${__dirname}/../${USERDATA}`);

/**! 
 *  Return all bot paths in .userdata as an object 
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

module.exports = allBotPaths