const is = require('is_js');
const profiler = require('../profile');
const path = require('path');

// There will need to be a repo available called test-repo. The repo should be
// a node project with a package.json file 
const testRepoName = 'test-repo';

describe('profile', () => {
  let p;

  beforeAll(async (done) => {
    // Abs path...
    const testRepoPath = path.resolve(__dirname, '..', '..', '..', 'spec', testRepoName);
    p = await profiler(testRepoPath);
    done();
  }); // Set a high timeout because sometimes repos take a 

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

