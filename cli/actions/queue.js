const debug = require('debug')('botfarm:cli:queueActions');
const error = require('debug')('botfarm:error:cli:queueActions');
const Table = require('cli-table');
const ora = require('ora');
const db = require('core/db');
const queue = require('core/queue');
const { dueInString } = require('core/helpers/times');

module.exports = queueActions;

function queueActions(cmd, opts) {
  switch(cmd) {
    case 'show':
      db.queue.get().then(entries => showQueueTable(entries));
      break;    
    case 'rebuild':
      rebuildQueue().catch(err => console.log(err.toString()));
  }
}

function showQueueTable(entries) {
  const table = new Table({
    head: ['Bot', 'Due'],
    colWidths: [20, 60],
  });
  entries.forEach(e => {
    table.push([
      e.bot_name,
      dueInString(e.time)
    ]);
  });
  // console.log is a wrapper around stdout, so there's no reason not to use it
  // to return the queue table 
  console.log(table.toString());
}

async function rebuildQueue() {
  const msg = ora('Rebuilding the queue').start();
  await queue.renewQueue();
  msg.succeed('Queue successfully rebuilt!');
  db.queue.get().then(entries => showQueueTable(entries));
}