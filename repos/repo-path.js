const path = require('path');
const paths = require('paths');
const reposDir = paths.repos;

const repoPath = repoSlug => path.join(reposDir, repoSlug);

module.exports = { repoPath };