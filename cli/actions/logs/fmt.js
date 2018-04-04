const chalk = require('chalk');

const label = msg => chalk`{bgWhiteBright.black.bold ${msg}}`

const logHeader = (bot_name, time, type, runtime) => label(`${bot_name} ${time} ${type} [${runtime}ms] ➜ `);

function formatLogEntry(log) {
  const time = new Date(log.time);
  return `${logHeader(log.bot_name, time, log.type, log.runtime_ms)}\n\n${log.output}\n`;
}

module.exports = { label, formatLogEntry };