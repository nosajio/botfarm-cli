const debug = require('debug')('botfarm:cli:console');
const error = require('debug')('botfarm:error:cli');
const blessed = require('blessed');
const { statusBool } = require('cli/daemon');

function update(statusBox) {
  const statusMessage = statusBool() ? `{bold}Service running{/bold}` : `{bold}Service stopped{/bold}`;
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
    tags: true,
    padding: {
      left: 1,
    },
    style: {
      bg: 'blue',
      fg: 'white',
    }
  });
  update(statusBox);
  // Low priority update = 2 secs
  updateEvery(2, statusBox)
  return statusBox;
}


module.exports = genStatusbar;