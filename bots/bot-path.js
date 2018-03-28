const debug = require('debug')('botrepo:botfiles:botPath');
const { repoPath } = require('repos');
const path = require('path');

const botPath = (repoDir, loaderFile) => {
  debug(repoDir, loaderFile);
  return path.join(repoPath(repoDir), loaderFile);
}

module.exports = { botPath };