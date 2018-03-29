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

  // // Add the ui components to the main screen component
  screen.append(history);
  screen.append(queue);

  // Call render() on the master screen component to draw it on the screen
  screen.render();
}

function genHistoryBox() {
  const historyBox = blessed.box({
    left: 10,
    bottom: 10,
    content: 'History',
    width: '33%',
    height: '25%',
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
    }
  });
  return historyBox;
}

function genQueueBox() {
  const queueBox = blessed.box({
    left: 10,
    top: 'center',
    content: 'Queue',
    width: '33%',
    height: '25%',
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
    }
  });
  return queueBox;
}