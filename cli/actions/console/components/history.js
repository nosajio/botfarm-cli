const debug = require('debug')('botfarm:cli:console');
const error = require('debug')('botfarm:error:cli');
const blessed = require('blessed');
const { outputs } = require('db');
const { dueInString, timeString } = require('helpers/times');

/**
 * 
 * @param {number} index 
 * @param {string} repoName 
 * @param {string} botName 
 * @param {string} outType 'stdout' or 'stderr'
 * @param {number | string} time timestamp string from db
 * @param {number} runtime
 */
function historyTableRow(index, repoName, botName, outType, time, runtime) {
  const historyRow = blessed.box({
    top: index,
    height: 1,
    width: '100%',
  });
  const historyRowL = blessed.box({ tags: true, width: '50%' });
  const historyRowR = blessed.box({ tags: true, left: '50%', width: '50%' });
  let nameAndStatus = '';
  if (outType === 'stderr') {
    nameAndStatus = `{red-fg}${repoName}/${botName}{/red-fg}`;
  } else {
    nameAndStatus = `{green-fg}${repoName}/${botName}{/green-fg}`;
  }
  historyRowL.setContent(`{grey-fg}${timeString(time)}{/grey-fg} ${nameAndStatus}`);    
  historyRowR.setContent(`{right}${runtime}ms{/}`);
  historyRow.append(historyRowL);
  historyRow.append(historyRowR);
  // historyRow.setContent(`${repoName}/${botName}`);
  return historyRow;
}

async function historyTable() {
  const last15Outputs = await outputs.allWithRefs(15, false);
  const table = blessed.box({
    scrollable: true,
    alwaysScroll: true,
    mouse: true,    
  });
  last15Outputs.forEach((op, i) => {
    table.append( historyTableRow(i, op.repo.name, op.bot_name, op.type, op.time, op.runtime_ms) )
  });
  return table;
}

function renderHistoryTable(historyBox, tableBox) {
  historyBox.append(tableBox);
  historyBox.screen.render();
} 

function updateEvery(seconds, historyBox) {
  setTimeout(() => {
    // Remove the table
    historyBox.children.pop();
    // Re-add the table with fresh data
    historyTable().then(tableBox => {
      renderHistoryTable(historyBox, tableBox);
      updateEvery(seconds, historyBox);
    });
  }, seconds * 1000);
}

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

  historyTable().then(tableBox => {
    renderHistoryTable(historyBox, tableBox);
    updateEvery(1, historyBox);
  });
  return historyBox;
}


module.exports = genHistoryBox;