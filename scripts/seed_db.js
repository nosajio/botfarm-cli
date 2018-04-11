const debug = require('debug')('botfarm:seed_db');
const path = require('path');
const paths = require('paths');
const { readFileSync } = require('fs');
const Database = require('better-sqlite3');

// First, create the database, then run the seed once the database has
// been created.
const dbFileLocation = path.join(paths.userdata, 'store.sqlite');
try {
  new Database(dbFileLocation);
  seed();
} catch(err) {
  console.error(err);
}

function seed() {
  // Load db after the database file has been created. This is important because
  // simply requiring the db, it will automatically try to connect to the 
  // database.
  const db = require('db');

  // Edit the schema.sql file to modify the schema
  const seedSQL = readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');
  db.instance.exec(seedSQL, err => {
    if (err) {
      throw err;
      console.log('✖ Create data store');
    }
    console.log('✔ Create data store');
  });
}