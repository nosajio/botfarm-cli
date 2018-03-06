const is = require('is_js');
const debug = require('debug')('botfarm:db:query');

/**
 * Simple promise wrapper around sqlite's run command
 */

const query = (db, str, params=[]) => new Promise(resolve => {
  const isSelectQuery = str.includes('SELECT');
  if (isSelectQuery) {
    db.get(str, params, (err, rows) => {
      if (err) {
        throw err;
      }
      resolve(is.array(rows) ? rows : [rows]);
    });
  } else {
    db.run(str, params, (err) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  }
  
});

module.exports = query;