const query = require('../query');
const path = require('path');
const paths = require('paths');
const Database = require('better-sqlite3');

describe('query wrapper', () => {
  let db, created_ids = [];

  beforeAll(() => {
    const dbPath = path.join(paths.userdata, 'store.sqlite');    
    db = new Database(dbPath);
  });


  it('should return id after insert', async () => {
    const params = [
      Date.now(), // time
      '1', // repo_id
      'test', // repo_name
      'bot'  // bot_name
    ]
    const created_id = await query(db, 'INSERT INTO bot_queue (time, repo_id, repo_name, bot_name) VALUES (?, ?, ?, ?)', params);
    created_ids.push(created_id);
    expect(parseInt(created_id) !== 'NaN');
  });
  

  it('should delete things', async () => {
    if (! created_ids.length) { expect(false); }
    const poppedId = created_ids.pop();
    const deleted_id = await query(db, 'DELETE FROM bot_queue WHERE id = ?', [poppedId]);
    expect(deleted_id);
  });

  
  it('should return things', async () => {
    const rows = await query(db, 'SELECT * FROM bot_queue', []);
    expect(rows.length > 0);
  });


  it('should convert Date types to unix time', async () => {
    const params = [
      new Date(), // time
      '1111', // repo_id
      'test2', // repo_name
      'bot2'  // bot_name
    ];
    const created_id = await query(db, 'INSERT INTO bot_queue (time, repo_id, repo_name, bot_name) VALUES (?, ?, ?, ?)', params);
    created_ids.push(created_id);
    expect(created_id);
  });

  
  afterAll(() => {
    // cleanup records used for testing
    return Promise.all(
      created_ids.map(id => query(db, 'DELETE FROM bot_queue WHERE id = ?', [id]))
    );
  });
  
});