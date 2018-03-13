const query = require('./query');

module.exports = db => ({

  /**
   * Capture output of a bot
   * 
   * @param {string} type
   * @param {string} output
   * @param {number} farmId
   * @param {string} bot_name
   */
  capture: async (type, output, farmId, bot_name) => {
    try {
      const currTime = new Date();
      await query(db, 'INSERT INTO bot_outputs (type, output, farm_id, bot_name, time) VALUES($1, $2, $3, $4, $5)', [type, output, farmId, bot_name, currTime]);
      return;
    } catch(err) {
      error(err);
    }
  }
});