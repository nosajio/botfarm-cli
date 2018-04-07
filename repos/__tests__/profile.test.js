const is = require('is_js');
const profiler = require('../profile');
const create = require('../create');

// There will need to be a repo available called test-bots. The repo should be
// a node project with a package.json file 
const testRepoName = 'test-bots';

describe('profile', async () => {
  let p;
  beforeAll(async () => {
    p = await profiler(testRepoName);
  })

  it('should return an object', () => {
    expect(is.object(p));
  });

  it('should check if it\'s a node project', () => {
    expect(p.nodeProject);
  });

  it('should return an array of files', () => {
    expect(is.array(p.files.list));
    expect(is.not.empty(p.files.list));
  });

  it('should check if the botfile exists', () => {
    expect(p.hasBotfile);
  })
});

