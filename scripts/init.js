const paths = require('../paths');
const fs = require('fs');

// Create directories in the user's home folder where botfarm will store its data
Object.entries(paths).forEach(([name, val]) => {
  try {
    fs.mkdirSync(val)
    console.log('Created %s directory: %s', name, val);
  } catch(err) {}
});

console.log('Done');