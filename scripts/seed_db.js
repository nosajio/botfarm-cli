const debug = require('debug')('botfarm:seed_db');
const path = require('path');
const paths = require('paths');
const { readFileSync } = require('fs');
const { Database, OPEN_READWRITE, OPEN_CREATE } = require('sqlite3');

// First, create the database, then run the seed once the database has
// been created.
const dbFileLocation = path.join(paths.userdata, 'store.sqlite');
new Database(dbFileLocation, OPEN_READWRITE | OPEN_CREATE, err => {
  if (err) {
    throw err;
  }
  seed();
})

function seed() {
  // Load db after the database file has been created. This is important because
  // simply requiring the db, it will automatically try to connect to the 
  // database.
  const db = require('db');

  // Edit the schema.sql file to modify the schema
  const seedSQL = readFileSync(path.resolve(process.env.NODE_PATH, 'schema.sql'), 'utf8');
  db.instance.exec(seedSQL);
}