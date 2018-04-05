const debug = require('debug')('botfarm:cli:queueActions');
const error = require('debug')('botfarm:error:cli:queueActions');
const blessed = require('blessed');

const genHistoryBox = require('./components/history');
const genLogsBox = require('./components/logs');
const genQueueBox = require('./components/queue');

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

  // Add the ui components to the main screen component
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
