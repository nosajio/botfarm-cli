const blessed = require('blessed');
const queue = require('queue');

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

module.exports = genQueueBox;