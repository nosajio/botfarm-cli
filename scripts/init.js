const error = require('debug')('botfarm:error:db');
const paths = require('../paths');
const fs = require('fs');

// Create directories in the user's home folder where botfarm will store its data
Object.entries(paths).forEach(([name, val]) => {
  try {
    fs.mkdirSync(val)
    console.log('✔ Create %s directory: %s', name, val);
  } catch(err) {
    console.log('✖ Create %s directory: %s', name, val);
    error(err);
  }
});

fs.chmodSync(paths.userdata, 0764);
console.log('✔ Alter permissions for %s', paths.userdata);