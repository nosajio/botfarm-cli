const debug = require('debug')('botfarm:repos:repoWithBotfile');
const error = require('debug')('botfarm:error:repos:repoWithBotfile');
const { repos } = require('db');
const getBotfile = require('./get-botfile');

const repoWithBotfile = async id => {
  const repo = await repos.get(id);
  const botfile = getBotfile(repo.dir)();
  return Object.assign({}, repo, { botfile });
}

module.exports = repoWithBotfile;