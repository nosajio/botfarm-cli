const debug = require('debug')('botfarm:bots:fs');
const error = require('debug')('botfarm:error:bots:fs');
const fs = require('fs');
const path = require('path');

const { FARMS } = process.env;
const farmsPath = path.resolve(`${__dirname}/../${FARMS}`);

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
  const botfarms = fs.readdirSync(farmsPath, 'utf8');
  const botfarmPaths = botfarms.map(dir => ([`${farmsPath}/${dir}`, dir]));
  return botfarmPaths;
};

module.exports = allBotPaths