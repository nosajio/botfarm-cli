const fs = require('fs');
const paths = require('paths');

// Quick and easy way to know wheather botfarm is already installed :)
module.exports = () => {
  const exists = fs.existsSync(paths.userdata);
  return exists;
}