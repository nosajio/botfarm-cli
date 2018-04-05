const blessed = require('blessed');

function genHistoryBox(top = '70%', left = 0, width = '30%') {
  const historyBox = blessed.box({
    top, 
    left,
    width,
    label: 'History',
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