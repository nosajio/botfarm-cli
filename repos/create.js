const { repos } = require('db');
const validate = require('repos/validate');

const createFarm = async (url, dir) => {
  const validated = await validate(dir);
  if (! validated.valid) {
    // return Promise.reject(validated.reason);
  }
  await repos.new(url, dir).catch(err => { throw err });
  return true;
}

module.exports = createFarm