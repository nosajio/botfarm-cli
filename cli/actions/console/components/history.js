const blessed = require('blessed');

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


module.exports = genHistoryBox;