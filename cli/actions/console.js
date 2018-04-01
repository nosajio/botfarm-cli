const debug = require('debug')('botfarm:cli:queueActions');
const error = require('debug')('botfarm:error:cli:queueActions');
const datefns = require('date-fns');
const blessed = require('blessed');
const db = require('db');
const queue = require('queue');

module.exports = consoleActions;

function consoleActions(opts) {
  setupConsoleUi(); 
}

function setupConsoleUi() {
  // The screen is the master element that holds all the blessed UI items
  const screen = blessed.screen({
    title: 'Bots Console',
  });

  const history = genHistoryBox();
  const queue = genQueueBox();
  const logs = genLogsBox();

  // // Add the ui components to the main screen component
  screen.append(queue);
  screen.append(history);
  screen.append(logs);

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
  const logsBox = blessed.box({
    left: '30%',
    top: 0,
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
  return logsBox;
}