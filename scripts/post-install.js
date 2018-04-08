const error = require('debug')('botfarm:error:post-install');
const path = require('path');
const { exec } = require('child_process');

const initSh = path.resolve(__dirname, 'init.sh');

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