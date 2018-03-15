const debug = require('debug')('botrepo:botfiles:botPath');
const { repoPath, repoPathAbs } = require('repos');
const path = require('path');

const botPath = (repoDir, loaderFile) => {
  debug(repoDir, loaderFile);
  return path.join(repoPath(repoDir), loaderFile);
}

const botPathAbs = (repoDir, loaderFile) => path.join(repoPathAbs(repoDir), loaderFile);

module.exports = { botPath, botPathAbs };