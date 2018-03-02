const debug = require('debug')('botfarm:queue:search');
const { farms } = require('db');

const findBotfile = async farmId => {
  const farm = await farms.findOne(farmId);
  debug(farm);
}

module.exports = findBotfile