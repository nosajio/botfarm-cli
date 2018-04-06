const path = require('path');
const paths = require('paths');
const reposDir = paths.repos;

/**
 * Absolute path to repo
 * @param {string} repoDir Directory name relative to .repos
 * @returns {string}
 */
const repoPath = repoDir => path.join(reposDir, repoDir);

module.exports = { repoPath };