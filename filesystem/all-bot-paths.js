const debug = require('debug')('botfarm:bots:fs');
const error = require('debug')('botfarm:error:bots:fs');
const fs = require('fs');
const path = require('path');

const { REPOS } = process.env;
const reposPath = path.resolve(`${__dirname}/../${REPOS}`);

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
  const repos = fs.readdirSync(reposPath, 'utf8');
  const repoPaths = repos.map(dir => ([`${reposPath}/${dir}`, dir]));
  return repoPaths;
};

module.exports = allBotPaths