const debug = require('debug')('botfarm:farms:farmsWithBotfiles');
const error = require('debug')('botfarm:error:farms:farmsWithBotfiles');
const { farms } = require('db');
const getBotfile = require('./get-botfile');

const farmsWithBotfiles = async () => {
  const allFarms = await farms.all();  
  const withBotfiles = allFarms.map(f => 
    Object.assign({}, f, { botfile: getBotfile(f.slug)() })
  );
  return withBotfiles;
}

module.exports = farmsWithBotfiles;