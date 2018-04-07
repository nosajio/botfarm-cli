const debug = require('debug')('botfarm:cli:repoActions');
const error = require('debug')('botfarm:error:cli:repoActions');
const ora = require('ora');
const { renewQueue } = require('queue');

const addRepo = require('./action-add');
const listRepos = require('./action-list');
const removeRepo = require('./action-remove');
const { updateRepo, updateRepos } = require('./action-update');

/**
 * 
 */
function repoActions(cmd, locations) {
  let msg;
  switch(cmd) {

    case 'add': 
      const [url, dir] = locations;
      msg = ora('Adding repository').start();
      addRepo(url, dir)
        .then(
          () => msg.succeed(`Repository "${dir}" has been added`), 
          reason => { msg.fail(reason); error(reason);  })
        .catch(err => { msg.fail(err.toString); error(err); })
        // TODO: instead of renewing the queue here, restart the service entirely
        .then(() => renewQueue());
      break;

    case 'list': 
      msg = ora('Listing repositories').start();
      listRepos()
        .then(() => msg.stop())
        .catch(err => { msg.fail(err.toString()); error(err) });     
      break;

    case 'remove': 
      msg = ora(`Removing repository ${locations[0]}`).start();
      const genericError = 'There was a problem deleting the repository. Check the directory name is correct. If error persists, make sure node has write and delete access to the ./.userfiles directory.';
      removeRepo(locations[0])
        .then(() => renewQueue())
        .then(() => msg.succeed('Repository has been removed.'))
        .catch(err => { msg.fail(genericError); error(err) });
      break;

    case 'update': 
      const dirName = locations[0];
      if (dirName) {
        msg = ora('Updating repository');
        updateRepo(dirName)
          .then(() => renewQueue())
          .then(() => msg.succeed(`Repository "${dirName}" is now up to date.`))
          .catch(err => msg.fail(err.toString()));
      } else {
        msg = ora('Updating repositories');        
        updateRepos()
          .then(() => renewQueue())
          .then(() => msg.succeed('All repositories have been updated.'))
          .catch(err => { msg.fail(err.toString()); error(err); });
      }
      break;
  }
}

module.exports = repoActions;