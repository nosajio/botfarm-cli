const debug = require('debug')('botfarm:db:farms');
const query = require('./query');
const datefns = require('date-fns');
const uuid = require('uuid/v4');

module.exports = db => ({
  get: async id => {
    try {
      const row = await query(db, 'SELECT * FROM repos WHERE id = ?', [id]);
      return row[0];
    } catch(err) {
      throw err;
    }
  },

  getByDir: async dirName => {
    try {
      const row = await query(db, 'SELECT * FROM repos WHERE dir = ?', [dirName]);
      return row[0];
    } catch (err) {
      throw err;
    }
  },
  
  all: async () => {
    try {
      const rows = await query(db, 'SELECT * FROM repos');
      return rows;
    } catch(err) {
      throw err;
    }
  },

  new: async (repoUrl, repoName) => {
    try {
      const randomUUID = uuid();
      await query(db, 'INSERT INTO repos (uuid, name, dir, repository) VALUES (?, ?, ?, ?)', [randomUUID, repoName, repoName, repoUrl]);
      return randomUUID;
    } catch(err) {
      throw err;
    }
  },

  delete: async (id) => {
    try {
      await query(db, 'DELETE FROM repos WHERE id = ?', [id]);
      return;
    } catch(ere) {
      throw err;
    }
  },

  deleteByDir: async dir => {
    try {
      await query(db, 'DELETE FROM repos WHERE dir = ?', [dir]);
      return;
    } catch(err) {
      throw err;
    }
  }
});