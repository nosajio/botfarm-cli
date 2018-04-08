const debug = require('debug')('botfarm:cli:repoActions');
const error = require('debug')('botfarm:error:cli:repoActions');
const ora = require('ora');
const daemon = require('service/daemon');

const addRepo = require('./action-add');
const listRepos = require('./action-list');
const removeRepo = require('./action-remove');
const { updateRepo, updateRepos } = require('./action-update');

const restartService = () => {
  daemon.restart();
  process.exit();
}

const renderError = (msg, err) => {
  msg.fail(err.toString());
  error(err);
}

/**
 * 
 */
function repoActions(cmd, locations) {
  let msg;
  switch(cmd) {

    // Add a new repo
    // 
    // $ bots repos add http://repo.url repo-local-name
    case 'add': 
      const [url, dir] = locations;
      msg = ora('Adding repository').start();
      addRepo(url, dir)
        .catch(err => { renderError(msg, err) })
        .then(
          () => { msg.succeed(`Repository "${dir}" has been added`) }, 
          reason => { msg.fail(reason); error(reason); }
        )
        .then(() => restartService());
      break;

    // List installed repos
    // 
    // $ bots repos list
    case 'list':
      msg = ora('Listing repositories').start();
      listRepos()
        .catch(err => { renderError(msg, err) })
        .then(() => msg.stop());
      break;

    // Remove a repo
    // 
    // $ bots repos remove repo-local-name
    case 'remove': 
      msg = ora(`Removing repository ${locations[0]}`).start();
      const genericError = 'There was a problem deleting the repository. Check the directory name is correct. If error persists, make sure node has write and delete access to the ./.userfiles directory.';
      removeRepo(locations[0])
        .catch(err => { msg.fail(genericError); error(err) })
        .then(() => msg.succeed('Repository has been removed.'))
        .then(() => restartService());
      break;

    // Update one or many repos
    // 
    // To update one:
    // $ bots repos update repo-local-name
    // 
    // To update many:
    // $ bots repos update
    case 'update': 
      const dirName = locations[0];
      if (dirName) {
        msg = ora('Updating repository');
        updateRepo(dirName)
          .then(() => restartService())
          .then(() => msg.succeed(`Repository "${dirName}" is now up to date.`))
          .catch(err => { renderError(msg, err) });
      } else {
        msg = ora('Updating repositories');        
        updateRepos()
          .catch(err => { renderError(msg, err) })
          .then(() => msg.succeed('All repositories have been updated.'))
          .then(() => restartService());
      }
      break;
  }
}

module.exports = repoActions;