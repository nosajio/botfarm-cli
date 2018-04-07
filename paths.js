const path = require('path');
const os = require('os');

// 
// Various paths used by the application are stored in this file. Think
// of this file as an extension of .env
// 

// The root path to store .userdata directory where all the application
// data will live
// 
// Default is the user's home directory
const root = path.join(
  os.homedir ? 
    os.homedir() 
    : (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE)
);
const userdata = path.join(root, '.botfarm');

// CAUTION
// -----------------------------------------------------------------------------
// The paths below will be created by the postinstall script in the root 
// directory. If you don't want the directory to be created after install, 
// don't put it in appPaths.

const appPaths = {
  // Userdata directory location
  userdata,

  // The .logs directory, where the application logs will live, not bot output
  // logs – those are stored in sqlite
  logs: path.join(userdata, '.logs'),

  // The .repos directory 
  repos: path.join(userdata, '.repos'),
};

module.exports = appPaths;