const debug = require('debug')('botfarm:farms:botfileWithFarmId');
const error = require('debug')('botfarm:error:farms:botfileWithFarmId');
const { farms } = require('db');
const getBotfile = require('./get-botfile');

const botfileWithFarmId = async id => {
  const farm = await farms.get(id);
  const botfile = getBotfile(farm.slug);
  return botfile;
}

module.exports = botfileWithFarmId;