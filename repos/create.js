const { repos } = require('db');
const gitCmd = require('./git-cmd');
const validate = require('repos/validate');
const initRepo = require('./init-repo');

const createRepo = async (url, dir) => {
  const validated = await validate(dir);
  if (! validated.valid) {
    // return Promise.reject(validated.reason);
  }
  await gitCmd('', 'clone', `${url} ${dir || ''}`);
  await initRepo(dir);
  await repos.new(url, dir).catch(err => { throw err });
  return true;
}

module.exports = createRepo