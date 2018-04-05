const blessed = require('blessed');
const { Writable } = require('stream');
const streamLogs = require('cli/actions/logs/stream');


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

module.exports = genLogsBox;