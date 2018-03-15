const chalk = require('chalk');

const label = msg => chalk`{bgWhiteBright.black.bold ${msg}}`

const logHeader = (bot_name, time, type) => label(`${bot_name} ${time} ${type} ➜ `);

function formatLogEntry(log) {
  const time = new Date(log.time);
  return `${logHeader(log.bot_name, time, log.type)}\n\n${log.output}\n`;
}

module.exports = { label, formatLogEntry };