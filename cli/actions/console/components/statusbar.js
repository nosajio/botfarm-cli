const debug = require('debug')('botfarm:cli:console');
const error = require('debug')('botfarm:error:cli');
const blessed = require('blessed');
const { statusBool } = require('service/daemon');

function update(statusBox) {
  const running = statusBool();
  const statusMessage = running ? `Service running` : `Service stopped`;
  statusBox.style = {
    bg: running ? 'green' : 'white',
    fg: 'black',
    bold: true,
  }
  statusBox.setContent(statusMessage);
}

function updateEvery(seconds, statusBox) {
  setTimeout(() => {
    update(statusBox);
    updateEvery(seconds, statusBox);
  }, seconds * 1000);
}

function genStatusbar() {
  const statusBox = blessed.box({
    height: 1,
    left: 0,
    top: '100%-1',
    width: '100%-1',
    padding: {
      left: 1,
    },
    style: {
      bg: 'white',
      fg: 'black',
    }
  });
  update(statusBox);
  // Low priority update = 2 secs
  updateEvery(2, statusBox)
  return statusBox;
}


module.exports = genStatusbar;