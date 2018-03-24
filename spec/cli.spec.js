const test = require('tape');
const cliCmd = require('./exec-cli-cmd');

test('CLI commands', t => {
  t.test('service commands', tt => {
    tt.plan(3);
    cliCmd('service', 'status').then(([stdout, stderr]) => tt.false(stderr, '"status" did not error'));
    cliCmd('service', 'start').then(([stdout, stderr]) => tt.false(stderr, '"start" did not error'));
    cliCmd('service', 'stop').then(([stdout, stderr]) => tt.false(stderr, '"stop" did not error'));
  });
});