const debug = require('debug')('botfarm:repos:reposWithBotfiles');
const error = require('debug')('botfarm:error:repos:reposWithBotfiles');
const { repos } = require('core/db');
const getBotfile = require('./get-botfile');

const reposWithBotfiles = async () => {
  const allrepos = await repos.all();  
  const withBotfiles = allrepos.map(f => 
    Object.assign({}, f, { botfile: getBotfile(f.dir)() })
  );
  return withBotfiles;
}

module.exports = reposWithBotfiles;