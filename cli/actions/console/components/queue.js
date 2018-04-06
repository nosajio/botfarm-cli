const debug = require('debug')('botfarm:cli:console');
const error = require('debug')('botfarm:error:cli');
const blessed = require('blessed');
const { queue } = require('db');
const { dueInString } = require('helpers/times');

/**
 * Generate a row for the queue table
 */
const queueRow = (index, repoName, botName, time) => {
  const queueRow = blessed.box({
    top: index,
    tags: true,
    height: 1,
    width: '100%',
  });
  // Make boxes for inner text so that it can be moved around with ease
  const rowLeft = blessed.box({ left: 0, tags: true });
  rowLeft.setContent(`${repoName}/{bold}${botName}{/bold}`);
  const rowRight = blessed.box({ left: '50%', tags: true });
  const timeUntil = dueInString(new Date(time), true);
  rowRight.setContent(`{right}${timeUntil}{/right}`)
  // Add boxes to the row
  queueRow.append(rowLeft);
  queueRow.append(rowRight);
  return queueRow
}

/**
 * Generate a queue table and return it
 * @param {array} queueItems Rows from the queue table
 */
const queueTable = async queueItems => {
  const queueData = await queue.getWithRefs();
  const table = blessed.box({
  });
  queueData.forEach((it, i) => {
    table.append(queueRow(i, it.repo.name, it.bot_name, it.time));
  });
  return table;
}

/**
 * Keep the queue list up to date by polling the database for changes
 * @param {number} seconds 
 */
function updateEvery(seconds, queueBox) {
  setTimeout(() => {
    // Refetch the data
    queueTable().then(tableBox => {
      // Start by removing the table from the queue box
      queueBox.children.pop();
      renderTableBox(queueBox, tableBox);
      updateEvery(seconds, queueBox);
    });
  }, seconds * 1000)
}


function genQueueBox(top = 0, left = 0, width = '30%', height = '70%') {
  const queueBox = blessed.box({
    left,
    top,
    width,
    height,
    label: 'Queue',
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
    }
  });

  queueTable().then(tableBox => {
    renderTableBox(queueBox, tableBox);
    updateEvery(1, queueBox)
  }).catch(err => error(err));

  return queueBox;
}

function renderTableBox(queueBox, tableBox) {
  queueBox.append(tableBox);
  queueBox.screen.render();
}

module.exports = genQueueBox;
