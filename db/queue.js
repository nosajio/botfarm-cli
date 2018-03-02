const debug = require('debug')('botfarm:db:queue');

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
      const rows = await db.query('INSERT INTO bot_queue (bot_name, time, farm_id) VALUES ($1, $2, $3)', [item.bot_name, item.time, item.farm_id]);
      return rows;
    } catch (err) {
      throw err;
    }
  },


  search: async ({ before }) => {
    let query, predicate;
    if (before) {
      query = `SELECT * FROM bot_queue WHERE time >= $1::date`;
      predicate = before;
    }
    const result = await db.query(query, [predicate]);
    debug(result);
    return result;
  },


  /**
   *  Take item from the queue. This will remove the item from the queue and
   *  return it.
   *  @param {number} id
   *  @return {object} item
   */
  take: async ids => {
    try {
      const rows = await db.query('DELETE FROM bot_queue WHERE id=$1 RETURNING *', [id]);
      return rows;
    } catch(err) {
      throw err;
    }
  },


  deleteAll: async () => {
    try {
      await db.query('DELETE FROM bot_queue');
    } catch (err) {
      throw err;
    }
  },

  
});