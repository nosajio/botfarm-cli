const paths = require('paths');
const path = require('path');
const fs = require('fs');

describe('DB instance', () => {
  test('database file should exist', () => {
    const dbPath = path.join(paths.userdata, 'store.sqlite');
    const fileExists = fs.existsSync(dbPath);
    expect(fileExists);
  });
});