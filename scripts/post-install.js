const error = require('debug')('botfarm:error:post-install');
const path = require('path');
const { exec } = require('child_process');

// If the .botfarm directory already exists, then just return here because it's
// already installed on this device
const botfarmDirExists = require('./dir-check');
if (botfarmDirExists()) {
  console.log('Botfarm is already installed!');
} else {

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
}

// Only when this is the testing environment, build populate the testable userdata
// directory with data needed for testing.
if (process.env.TESTING) {
  require('./setup-tests');
}