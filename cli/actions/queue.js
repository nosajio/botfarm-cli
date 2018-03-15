const debug = require('debug')('botfarm:cli:queueActions');
const error = require('debug')('botfarm:error:cli:queueActions');
const Table = require('cli-table');
const datefns = require('date-fns');
const ora = require('ora');
const db = require('db');
const queue = require('queue');

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

function dueInString(timestamp) {
  const dueDate = new Date(timestamp);
  const now = new Date();
  const distance = datefns.distanceInWords(dueDate, now);
  return now > dueDate ? `${distance} ago` : distance;
}

async function rebuildQueue() {
  const msg = ora('Rebuilding the queue').start();
  await queue.renewQueue();
  msg.succeed('Queue successfully rebuilt!');
}