const paths = require('../paths');
const fs = require('fs');

console.log('\n-----------------------------------------------------------------------------');
console.log('Botfarm Installing\n');

// Create directories in the user's home folder where botfarm will store its data
Object.entries(paths).forEach(([name, val]) => {
  try {
    fs.mkdirSync(val)
    console.log('✔ Created %s directory: %s', name, val);
  } catch(err) {
    console.error(err);
  }
});

fs.chmodSync(paths.userdata, 0777);
console.log('✔ Altered permissions for %s', paths.userdata);

console.log('\n*~*~Done*~*~');

console.log('\n-----------------------------------------------------------------------------\n')