const debug = require('debug')('botfarm:cli:queueActions');
const error = require('debug')('botfarm:error:cli:queueActions');
const datefns = require('date-fns');
const blessed = require('blessed');
const db = require('db');
const queue = require('queue');
const { Writable } = require('stream');
const streamLogs = require('./logs/stream');

module.exports = consoleActions;

function consoleActions(opts) {
  setupConsoleUi(); 
}


function setupConsoleUi() {
  // The screen is the master element that holds all the blessed UI items
  const screen = blessed.screen({
    title: 'Bots Console',
    smartCSR: true,
  });

  const history = genHistoryBox();
  const queue = genQueueBox();
  const logs = genLogsBox();
  
  // // Add the ui components to the main screen component
  screen.append(queue);
  screen.append(history);
  screen.append(logs);

  // Close console with ctrl-c or q
  screen.key(['C-c', 'q'], function (ch, key) {
    screen.destroy();
    process.exit();
  });
  
  // Call render() on the master screen component to draw it on the screen
  screen.render();
}

function genQueueBox() {
  const queueBox = blessed.box({
    left: 0,
    top: 0,
    label: 'Queue',
    width: '30%',
    height: '70%',
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
    }
  });
  return queueBox;
}

function genHistoryBox() {
  const historyBox = blessed.box({
    left: 0,
    top: '70%+1',
    label: 'History',
    width: '30%',
    height: '30%',
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
    }
  });
  return historyBox;
}

function genLogsBox() {
  const writeStream = new Writable;
  const logsBox = blessed.box({
    // Scroll config
    scrollable: true,
    alwaysScroll: true,
    mouse: true,
    scrollbar: { 
      style: { bg: 'white' }
    },

    left: '30%',
    top: 0,
    // input: writeStream,
    label: 'Logs',
    width: '70%',
    height: '100%',
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
    }
  });
  // Every time a new log is available, add it to the bottom of the box
  writeStream._write = (chunk, encoding, next) => {
    logsBox.insertBottom(chunk.toString());
    logsBox.screen.render();
    logsBox.setScrollPerc(100);
    next();
  }
  streamLogs(null, null, writeStream);
  return logsBox;
}