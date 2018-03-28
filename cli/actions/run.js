const debug = require('debug')('botfarm:cli:runActions');
const error = require('debug')('botfarm:error:cli:runActions');
const ora = require('ora');
const { runner } = require('bots');


module.exports = runActions;

function runActions(pathName) {
  const [repoName, botName] = pathName.split('/');
  const msg = ora(`Running bot ${botName} in ${repoName}`);
  runner.loadAndRunBot(repoName, botName)
    .then(() => { 
      msg.succeed(`Bot has run successfully. Run "bots logs --bot ${botName}" to see the output.`); 
    })
    .catch(err => {
      msg.fail(`Bot cannot be run. Are you sure it's in the ${repoName} repo?`);
      error(err);
    });
}