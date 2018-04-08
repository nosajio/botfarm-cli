const error = require('debug')('botfarm:error:post-install');
const path = require('path');
const { exec } = require('child_process');

const initSh = path.resolve(__dirname, 'init.sh');

// Run the init shell script
// exec(`sh ${initSh}`, { cwd: path.resolve(__dirname, '..') }, (err, stdout, stderr) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   if (stderr) {
//     console.error(stderr);
//     return;
//   }
//   console.log(stdout);
// });


console.log('\nBotfarm Installing\n');

const createDirsScript = path.resolve(__dirname, 'init.js');
require(createDirsScript);

// Setup the sqlite table structure
const seedDbScript = path.resolve(__dirname, 'seed_db.js');
try {
  require(seedDbScript);
} catch (err) {
  error(err);
}