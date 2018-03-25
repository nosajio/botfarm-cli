const test = require('tape');
const path = require('path');
const cliCmd = require('./exec-cli-cmd');
const is = require('is_js');

const testRepo = path.join(__dirname, 'test-repo');
// Give the repo a random name to avoid conflicting with user added repos
const testRepoName = String(Math.floor(100000000 + Math.random() * 900000000));


test('CLI commands', t => {

  t.test('service', tt => {
    tt.plan(2);
    cliCmd('service', 'start').then(([stdout, stderr]) => {
      tt.false(stderr, '"start" did not error')
      // Nest status and stop commands inside of start cb to avoid race conditions
      cliCmd('service', 'status').then(([stdout, stderr]) => tt.false(stderr, '"status" did not error'));
    });
  });


  t.test('queue', tt => {
    tt.plan(1);
    cliCmd('queue', 'show').then(([stdout, stderr]) => tt.false(stderr, '"show" did not error'));
  });


  t.test('add repo', tt => {
    tt.plan(1);
    cliCmd('repos', ['add', testRepo, testRepoName]).then(([stdout, stderr]) => {
      tt.false(stderr, '"add" did not error')
    });
  });


  t.test('run', tt => {
    tt.plan(1);
    cliCmd('run', `${testRepoName}/helloworld`).then(([stdout, stderr]) => tt.false(stderr, '"run" did not error'));    
  });


  t.test('logs', tt => {
    tt.plan(2);
    cliCmd('logs', 'show').then(([stdout, stderr]) => {
      tt.false(stderr, '"show" did not error');
      tt.true(is.string(stdout), '"show" outputs a string to stdout');
    });    
    // cliCmd('logs', '').then(([stdout, stderr]) => tt.false(stderr, '"show" did not error'));    
  });


});

test('remove repo', t => {
  t.plan(1);
  cliCmd('repos', ['remove', testRepoName]).then(([stdout, stderr]) => t.false(stderr, '"remove" did not error'));
});

test('stop service', t => {
  t.plan(1);
  cliCmd('service', 'stop').then(([stdout, stderr]) => t.false(stderr, '"stop" did not error'));
})