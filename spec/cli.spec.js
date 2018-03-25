const test = require('tape');
const path = require('path');
const cliCmd = require('./exec-cli-cmd');

test('CLI commands', t => {
  t.test('service', tt => {
    tt.plan(3);
    cliCmd('service', 'start').then(([stdout, stderr]) => {
      tt.false(stderr, '"start" did not error')
      // Nest status and stop commands inside of start cb to avoid race conditions
      cliCmd('service', 'status').then(([stdout, stderr]) => tt.false(stderr, '"status" did not error'));
      cliCmd('service', 'stop').then(([stdout, stderr]) => tt.false(stderr, '"stop" did not error'));
    });
  });

  t.test('service', tt => {
    tt.plan(1);
    cliCmd('queue', 'show').then(([stdout, stderr]) => tt.false(stderr, '"show" did not error'));
  });

  t.test('repos', tt => {
    tt.plan(2);
    const testRepo = path.join(__dirname, 'test-repo');
    // Give the repo a random name to avoid conflicting with user added repos
    const testRepoName = String(Math.floor(100000000 + Math.random() * 900000000));
    cliCmd('repos', ['add', testRepo, testRepoName]).then(([stdout, stderr]) => {
      tt.false(stderr, '"add" did not error')
      // Nest remove in add to avoid race conditions
      cliCmd('repos', ['remove', testRepoName]).then(([stdout, stderr]) => tt.false(stderr, '"remove" did not error'));
    });
  });
});