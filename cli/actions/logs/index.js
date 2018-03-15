const debug = require('debug')('botfarm:cli:logsActions');
const error = require('debug')('botfarm:error:cli:logsActions');
const db = require('db');
const { formatLogEntry, label } = require('./fmt');
const streamLogs = require('./stream');

module.exports = logsActions;


function logsActions(opts) {
  if (! opts.bot) {
    getAllLogs(opts)
  }
  if (opts.bot) {
    getLogsForBot(opts.bot);
  }
}

function getLogsForBot(botName) {
  const searchOpts = {
    bot_name: botName,
    limit: 50,
  };
  db.outputs.search(searchOpts)
    .then(logs => {
      const logsFormatted = logs.map(l => formatLogEntry(l));
      console.log(logsFormatted.join(''))
    })
    .catch(err => error(err));
}


function getAllLogs(opts) {
  const { stream } = opts;
  if (stream) {
    console.log(label('Streaming all new logs...'));
    streamLogs(null, opts);
    return;
  }
  db.outputs.all().then(logs => {
    const logsFormatted = logs.map(l => formatLogEntry(l));
    console.log(logsFormatted.join(''))
  })
  .catch(err => error(err));

}