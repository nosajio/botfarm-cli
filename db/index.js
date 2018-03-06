const debug = require('debug')('botfarm:db');
const path = require('path');
const { Database } = require('sqlite3');

const dbFileLocation = path.resolve(__dirname, '../.userdata/store.sqlite');

// The instance of the database will be assigned to the db variable
const db = new Database(dbFileLocation, err => {
  if (err) {
    throw err;
  }
  debug('Established db connection');
});

module.exports = {
  instance: db,
  farms:   require('./farms')(db),
  history: require('./history')(db),
  outputs: require('./outputs')(db),
  queue:   require('./queue')(db),
}

