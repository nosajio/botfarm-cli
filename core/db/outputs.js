const error = require('debug')('botfarm:error:db:outputs');
const debug = require('debug')('botfarm:db:outputs');
const is = require('is_js');
const query = require('./query');

// Helper to sort logs so new ones are at the end of the output. Makes it 
// easier to trawl through them on the command line
const sortOutputsAsc = outputs => outputs.sort((a, b) => a.id - b.id);

module.exports = db => {
  /**
   * Capture output of a bot
   * 
   * @param {string} type
   * @param {string} output
   * @param {number} repoId
   * @param {string} bot_name
   * @param {number} startTime The time the bot started in milliseconds
   */
  const capture = async (type, output, repoId, bot_name, repo_name, startTime) => {
    const runtime_ms = Date.now() - parseInt(startTime);
    try {
      await query(db, 'INSERT INTO bot_outputs (type, output, repo_id, bot_name, repo_name, runtime_ms, time) VALUES(?, ?, ?, ?, ?, ?, ?)', [type, output, repoId, bot_name, repo_name, runtime_ms, startTime]);
      return;
    } catch (err) {
      error(err);
      return null;
    }
  }

  /**
   * Return all rows between start and end ids (defaults to 50 rows)
   * @param {number} limit
   * @param {bool} sortAsc - Should the results be in ascending order?
   */
  const all = async (limit = 50, sortAsc = true) => {
    try {
      const rows = await query(db, 'SELECT * FROM bot_outputs ORDER BY id DESC LIMIT ? ', [limit]);
      if (is.empty(rows)) {
        return [];
      }
      const sortedRows = sortAsc ? sortOutputsAsc(rows) : rows;
      return sortedRows;
    } catch (err) {
      error(err);
      return null;
    }
  }

  /**
   * Return all rows with repos inline
   * @param {number} limit 
   * @param {bool} sortAsc 
   */
  const allWithRefs = async (limit = 50, sortAsc = true) => {
    const allRows = await all(limit, sortAsc);
    if (! allRows) return null;
    const repoQueries = allRows.map(q =>
      query(db, 'SELECT * FROM repos WHERE id = ?', [q.repo_id])
    );
    const reposIndex = (await Promise.all(repoQueries)).reduce((index, [curr]) => (
      { ...index, [curr.id]: curr }
    ), {});
    const outputsWithRefs = allRows.map(q => ({ ...q, repo: reposIndex[q.repo_id] }));
    return outputsWithRefs;
  }

  /**
   * Search and filter the logs before returning them
   * @param {object} opts
   * @param {string} opts.bot_name
   * @param {number} opts.id_gt
   * @param {number} opts.id_lt
   * @param {number} opts.limit
   */
  const search = async ({ bot_name, id_gt, id_lt, limit }) => {
    try {
      // Construct the query using options
      const querySelect = 'SELECT * FROM bot_outputs';
      const queryParts = [];
      const queryParams = [];
      if (bot_name) {
        queryParams.push(bot_name);
        queryParts.push(`bot_name = ?`);
      }
      if (id_gt) {
        queryParams.push(id_gt);
        queryParts.push(`id > ?`);
      }
      if (id_lt) {
        queryParams.push(id_lt);
        queryParts.push(`id < ?`);
      }

      // Without any query parts or params, the query can't be constructed
      if (is.empty(queryParts) || is.empty(queryParams)) {
        return [];
      }

      let queryStr = queryParts.length > 1 ? queryParts.join(' AND ') : queryParts[0];
      const limitStr = limit ? `LIMIT ${limit}` : '';
      const searchQuery = `${querySelect} WHERE ${queryStr} ORDER BY id DESC ${limitStr}`;
      const rows = await query(db, searchQuery, queryParams);

      if (is.empty(rows)) {
        return [];
      }

      const sortedRows = sortOutputsAsc(rows);
      return rows;
    } catch (err) {
      error(err);
      return null;
    }
  }

  return { capture, all, allWithRefs, search }
}