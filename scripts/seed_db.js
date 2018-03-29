const db = require('db');
const path = require('path');
const { readFileSync } = require('fs');

const seedSQL = readFileSync(path.resolve(process.env.NODE_PATH, 'schema.sql'), 'utf8');

db.instance.exec(seedSQL);