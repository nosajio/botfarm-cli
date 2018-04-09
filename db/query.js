const debug = require('debug')('botfarm:db:query');
const datefns = require('date-fns');
const is = require('is_js');

const sanitizeParameters = params => 
  params.map(p => {
    if (is.date(p)) {
      return parseInt(datefns.format(p, 'x'));
    }
    return p;
  });

/**
 * Simple promise wrapper around sqlite's run command
 */

const query = async (db, str, params=[]) => {
  const query = db.prepare(str);
  
  // Make the params acceptable to better sqlite...
  if (params.length) {
    const originalParams = params;
    params = sanitizeParameters(params);
  }

  debug('%s, params: %o', str, params);

  // With better-sqlite3, queries that return data are executed differently
  const isSelectQuery = str.includes('SELECT');
  if (isSelectQuery) {
    const rows = query.all(...params);
    return rows;
  }

  try {
    // All queries that don't retrun anything are executed with 'run'
    const response = query.run(...params);
    return response.lastInsertROWID;
  } catch(err) {
    throw err;
  }
};

module.exports = query;