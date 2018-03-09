const debug = require('debug')('botfarm:farms:farmWithBotfile');
const error = require('debug')('botfarm:error:farms:farmWithBotfile');
const { farms } = require('db');
const getBotfile = require('./get-botfile');

const farmWithBotfile = async id => {
  const farm = await farms.get(id);
  const botfile = getBotfile(farm.slug)();
  return Object.assign({}, farm, { botfile });
}

module.exports = farmWithBotfile;