const path = require('path');
const cliCmd = require('./exec-cli-cmd');
const is = require('is_js');

// Just outputs a string of numbers
const randomNameGenerator = () => `_safe_to_delete_${String(Math.floor(100000000 + Math.random() * 900000000))}`;

const testRepo = path.join(__dirname, 'test-repo');
const invalidRepo = path.join(__dirname, 'invalid-repo');
// Give the repo a random name to avoid conflicting with user added repos
const testRepoName = randomNameGenerator();
const invalidRepoName = randomNameGenerator();


describe('CLI integration tests', () => {
  let startStdout, startStderr;
  beforeAll(async () => {
    [startStdout, startStderr] = await cliCmd('service', 'start');
  });

  describe('service', () => {
    it('doesn\'t error on "start"', () => {
      expect(!startStderr)
    });

    it('doesn\'t error on "status"', async () => {
      // Nest status commands inside of start cb to avoid race conditions
      const [statusStdout, statusStderr] = await cliCmd('service', 'status');
      return expect(!statusStderr)
    })
  });

  describe('queue', () => {
    it('doesn\'t error when running "queue show"', async () => {
      const [stdout, stderr] = await cliCmd('queue', 'show');
      expect(! stderr);
    });
  });

  describe('repo add', () => {
    it('doesn\'t error when running "repo add"', async () => {
      const [stdout, stderr] = await cliCmd('repos', ['add', testRepo, testRepoName]);
      expect(!stderr);      
    });
  });

  describe('run', () => {
    it('doesn\'t error when running "run"', async () => {
      const [stdout, stderr] = await cliCmd('run', `${testRepoName}/hi`);
      expect(!stderr);      
    });
  });

  describe('logs', () => {
    let stdout, stderr;
    beforeAll(async () => {
      [stdout, stderr] = await cliCmd('logs', 'show');
    });
    
    it('sends new logs to stdout', () => {
      expect(is.string(stdout));
    });

    it('doesn\'t error when showing logs', async () => {
      expect(! stderr);
    });
  });

  describe('Cleanup', () => {
    it('stops without errors', async () => {
      const [stdout, stderr] = await cliCmd('service', 'stop');
      expect(! stderr);
    });
  
    it('removes repo without error', async () => {
      const [stdout, stderr] = await cliCmd('repos', ['remove', testRepoName])
      expect(! stderr);
    });
  });

  describe('Invalid repo', () => {
    it('should fail when adding a repo with no botfile', async () => {
      const [stdout, stderr] = await cliCmd('repos', ['add', invalidRepo, invalidRepoName]);
      expect(is.string(stderr));
    });
  })
});