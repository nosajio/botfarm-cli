module.exports = db => ({
  findOne: async id => {
    try {
      const result = await db.query('SELECT * FROM farms WHERE id = $1', [id]);
      return result.rows;
    } catch(err) {
      throw err;
    }
  }
});