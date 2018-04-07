const debug = require('debug')('botfarm:db');
const path = require('path');
const { Database, OPEN_READWRITE } = require('sqlite3');
const paths = require('paths');

const dbFileLocation = path.join(paths.userdata, 'store.sqlite');

// The instance of the database will be assigned to the db variable,
// which will be passed to each one of the exports.
// 
// OPEN_READWRITE tells sqlite to be in read/write mode. For more info on modes,
// see the docs https://github.com/mapbox/node-sqlite3/wiki/API#new-sqlite3databasefilename-mode-callback
const db = new Database(dbFileLocation, OPEN_READWRITE, err => {
  if (err) {
    throw err;
  }
  debug('Established db connection');
});

module.exports = {
  instance: db,
  history: require('./history')(db),
  repos:   require('./repos')(db),
  outputs: require('./outputs')(db),
  queue:   require('./queue')(db),
}

