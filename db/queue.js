const debug = require('debug')('botfarm:db:queue');
const query = require('./query');

module.exports = db => ({

  /**
   *  Push an item into the queue
   *  @param {object} item
   *  @param {string} item.bot_name
   *  @param {Date} item.time
   *  @param {number} item.farmId
   */
  push: async item => {
    try {
      const rows = await query(db, 'INSERT INTO bot_queue (bot_name, time) VALUES ($1, $2)', [item.bot_name, item.time]);
      return rows;
    } catch (err) {
      throw err;
    }
  },


  search: async ({ before }) => {
    let queryStr, predicate;
    if (before) {
      queryStr = `SELECT * FROM bot_queue WHERE time <= CAST($1 AS TIMESTAMP)`;
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
  take: async ids => {
    try {
      const rows = await query(db, 'SELECT FROM bot_queue WHERE id=$1', [id]);
      // const rows = await query(db, 'DELETE FROM bot_queue WHERE id=$1 RETURNING *', [id]);
      return rows;
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