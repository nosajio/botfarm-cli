const debug = require('debug')('botfarm:db:farms');
const query = require('./query');
const datefns = require('date-fns');

module.exports = db => ({
  get: async id => {
    try {
      const row = await query(db, 'SELECT * FROM farms WHERE id = $1', [id]);
      return row[0];
    } catch(err) {
      throw err;
    }
  },
  
  all: async () => {
    try {
      const rows = await query(db, 'SELECT * FROM farms');
      return rows;
    } catch(err) {
      throw err;
    }
  }
});