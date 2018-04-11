const is = require('is_js');
const profiler = require('../profile');
const cliCmd = require('spec/exec-cli-cmd');
const path = require('path');

// There will need to be a repo available called test-bots. The repo should be
// a node project with a package.json file 
const testRepoName = '__test-bots__';

describe('profile', () => {
  let p;
  beforeAll(async () => {
    // Clone the test repo
    const testRepo = path.resolve(__dirname, '..', '..', '..', 'spec', 'test-repo');    
    const [stdout, stderr] = await cliCmd('repos', ['add', testRepo, testRepoName]);
    
    // Profile the test repo
    p = await profiler(testRepoName);

    return true;
  }, 10000); // Set a high timeout because sometimes repos take a 

  afterAll(async () => {
    // Remove the test repo
    const [stdout, stderr] = await cliCmd('repos', ['remove', testRepoName]);
    return;
  });

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

