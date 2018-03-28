const debug = require('debug')('botfarm:db');
const path = require('path');
const { Database } = require('sqlite3');
const paths = require('paths');

const dbFileLocation = path.join(paths.userdata, 'store.sqlite');

// The instance of the database will be assigned to the db variable
const db = new Database(dbFileLocation, err => {
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

