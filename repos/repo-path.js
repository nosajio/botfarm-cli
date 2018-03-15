const path = require('path');
const reposDir = process.env.REPOS;
const root = path.resolve(__dirname, '..');


const repoPath = repoSlug => path.join(reposDir, repoSlug);

const repoPathAbs = repoSlug => path.resolve(root, reposDir, repoSlug);

module.exports = { repoPath, repoPathAbs };