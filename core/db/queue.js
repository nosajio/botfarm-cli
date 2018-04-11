const debug = require('debug')('botfarm:db:queue');
const error = require('debug')('botfarm:error:db:queue');
const query = require('./query');
const datefns = require('date-fns');

module.exports = db => ({

  /**
   * Return the queue with repo references inlined
   */
  getWithRefs: async () => {
    try {
      const queueRows = await query(db, 'SELECT * FROM bot_queue ORDER BY time ASC', []);
      const repoQueries = queueRows.map(q => 
        query(db, 'SELECT * FROM repos WHERE id = ?', [q.repo_id])
      );
      const reposIndex = (await Promise.all(repoQueries)).reduce((index, [curr]) => (
        { ...index, [curr.id]: curr }
      ), {});
      const queueWithRepos = queueRows.map(q => ({ ...q, repo: reposIndex[q.repo_id]}));
      return queueWithRepos;
    } catch(err) {
      error(err);
      return null;
    }
  },
  
  get: async () => {
    try {
      const rows = await query(db, 'SELECT * FROM bot_queue ORDER BY time ASC', []);
      return rows;
    } catch(err) {
      error(err);
      return null;
    }
  },
  
  /**
   *  Push an item into the queue
   *  @param {object} item
   *  @param {string} item.bot_name
   *  @param {string} item.repo_name
   *  @param {Date} item.time
   *  @param {number} item.repoId
   */
  push: async item => {
    try {
      const rows = await query(db, 'INSERT INTO bot_queue (bot_name, repo_name, repo_id, time) VALUES (?, ?, ?, ?)', [item.bot_name, item.repo_name, item.repo_id, item.time]);
      return rows;
    } catch (err) {
      throw err;
    }
  },


  search: async ({ before }) => {
    let queryStr, predicate;
    if (before) {
      queryStr = `SELECT * FROM bot_queue WHERE time <= ?`;
      predicate = before;
    }
    const rows = await query(db, queryStr, [predicate]);
    return rows;
  },


  /**
   *  Take item from the queue. This will remove the item from the queue and
   *  return it.
   *  @param {number} id
   *  @return {object} item
   */
  take: async id => {
    try {
      const rows = await query(db, 'SELECT * FROM bot_queue WHERE id=?', [id]);
      if (rows) {
        // The row must be removed from the queue to prevent the bot being called > 1 time
        query(db, 'DELETE FROM bot_queue WHERE id=?', [id]);
        return rows;
      }
    } catch(err) {
      throw err;
    }
  },


  deleteAll: async () => {
    try {
      await query(db, 'DELETE FROM bot_queue');
    } catch (err) {
      throw err;
    }
  },

  
});