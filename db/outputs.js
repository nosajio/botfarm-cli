const error = require('debug')('botfarm:error:db:outputs');
const debug = require('debug')('botfarm:db:outputs');
const query = require('./query');

// Helper to sort logs so new ones are at the end of the output. Makes it 
// easier to trawl through them on the command line
const sortOutputsAsc = outputs => outputs.sort((a, b) => a.id - b.id);

module.exports = db => ({

  /**
   * Capture output of a bot
   * 
   * @param {string} type
   * @param {string} output
   * @param {number} repoId
   * @param {string} bot_name
   * @param {number} startTime The time the bot started in milliseconds
   */
  capture: async (type, output, repoId, bot_name, startTime) => {
    const runtime_ms = Date.now() - startTime;
    try {
      await query(db, 'INSERT INTO bot_outputs (type, output, repo_id, bot_name, runtime_ms, time) VALUES($1, $2, $3, $4, $5, $6)', [type, output, repoId, bot_name, runtime_ms, startTime]);
      return;
    } catch(err) {
      error(err);
      return null;
    }
  },

  /**
   * Return all rows between start and end ids (defaults to 50 rows)
   */
  all: async (limit=50) => {
    try {
      const rows = await query(db, 'SELECT * FROM bot_outputs ORDER BY id DESC LIMIT $1 ', [limit]);
      const sortedRows = sortOutputsAsc(rows);
      return sortedRows;
    } catch(err) {
      error(err);
      return null;
    }
  },

  /**
   * Search and filter the logs before returning them
   * @param {object} opts
   * @param {string} opts.bot_name
   * @param {number} opts.id_gt
   * @param {number} opts.id_lt
   * @param {number} opts.limit
   */
  search: async ({ bot_name, id_gt, id_lt, limit }) => {
    try {
      const querySelect = 'SELECT * FROM bot_outputs';
      const queryParts = [];
      const queryParams = [];
      if (bot_name) {
        queryParams.push(bot_name);
        queryParts.push(`bot_name = $${queryParams.length}`);
      }
      if (id_gt) {
        queryParams.push(id_gt);
        queryParts.push(`id > $${queryParams.length}`);
      }
      if (id_lt) {
        queryParams.push(id_lt);
        queryParts.push(`id < $${queryParams.length}`);
      }
      let queryStr = queryParts.length > 1 ? queryParts.join(' AND ') : queryParts[0];
      const limitStr = limit ? `LIMIT ${limit}` : '';
      const rows = await query(db, `${querySelect} WHERE ${queryStr} ORDER BY id DESC ${limitStr}`, queryParams);
      const sortedRows = sortOutputsAsc(rows);
      return rows;
    } catch(err) {
      error(err);
      return null;
    }
  }
});