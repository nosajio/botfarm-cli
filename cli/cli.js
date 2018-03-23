const debug = require('debug')('botfarm:cli');
const error = require('debug')('botfarm:error:cli');
const commander = require('commander');
const blessed = require('blessed');
const version = require('../package.json').version;

// Actions that will be run for all the different commands below
const serviceActions = require('./actions/service');
const logsActions = require('./actions/logs');
const queueActions = require('./actions/queue');
const repoActions = require('./actions/repos');
const runActions = require('./actions/run');

const app = commander.version(version);

registerCommands();

/**
 * Register all the different commands. See comments for examples
 */
function registerCommands() {
  // $ bot service <cmd>
  serviceCommands();
  // $ bot logs <cmd>
  logsCommands();
  // $ bot queue <cmd>
  queueCommands();
  // $ bot repos <cmd>
  repoCommands();
  // $ bot run reponame/botname{.js?}
  runCommands();
  // Parse the argv list for registered commands
  app.parse(process.argv);
}

/**
 * Commands for starting / stopping / restarting the service
 * $ bot service start <opts>
 * $ bot service stop <opts>
 */
function serviceCommands() {
  app
    .command('service <cmd>')
    .description('Start and stop the bots background service')
    .action(serviceActions);
}

/**
 * Commands for retrieving logs 
 * $ bot logs <opts>
 */
function logsCommands() {
  app
    .command('logs')
    .description('Retrieve logs for individual or all bots.')
    .option('-b, --bot <botName>', 'Get only logs for specific bot')
    .option('-t, --type <outputType>', 'Filter by output type (stderr, stdout)')
    .option('-s, --stream', 'Stream logs as they come in.')
    .action(logsActions);
}

/**
 * Commands for showing and interracting with the queue
 * $ bot queue show <opts>
 */
function queueCommands() {
  app
    .command('queue <cmd>')
    .description('Interract with the queue')
    .action(queueActions)
}

/**
 * Commands for adding and editing bot repositories
 * $ bot repos add git@repo.url:user/repository local_name
 */
function repoCommands() {
  app
    .command('repos <cmd> [locations...]')
    .description('Manage bot repositories')
    .action(repoActions);
}

/**
 * Commands for manually running bots
 * $ bot run repo/bot{.js?}
 */
function runCommands() {
  app
    .command('run <path>')
    .description('Run a bot manually')
    .option('-f --fork', 'Don\'t re-queue bot after running.')
    .action(runActions);
}