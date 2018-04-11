const debug = require('debug')('botfarm:repos:botfileWithRepoId');
const error = require('debug')('botfarm:error:repos:botfileWithRepoId');
const { repos } = require('core/db');
const getBotfile = require('./get-botfile');

const botfileWithRepoId = async id => {
  const repo = await repos.get(id);
  const botfile = getBotfile(repo.dir);
  return botfile;
}

module.exports = botfileWithRepoId;