const { repos } = require('core/db');
const gitCmd = require('./git-cmd');
const profile = require('./profile');
const initRepo = require('./init-repo');
const removeRepo = require('./remove-repo');

const createRepo = async (url, dir) => {
  const [stdout, stderr] = await gitCmd('', 'clone', `${url} ${dir || ''}`);

  await repos.new(url, dir).catch(err => { throw err });

  // Validate the repo once it's been added
  const repoInfo = await profile(dir);
  if (! repoInfo.hasBotfile) {
    await removeRepo(dir);
    throw new Error('Repo cannot be added because it doesn\'t have a botfile.js file.');
  }
  
  await initRepo(dir);
  return [true, stdout, stderr];
}

module.exports = createRepo