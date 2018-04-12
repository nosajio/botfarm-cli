const path = require('path');
const cliCmd = require('../spec/exec-cli-cmd');

console.log('Setting up tests...');

// There will need to be a repo available called test-repo. The repo should be
// a node project with a package.json file 
const testRepoName = '__test-bots__';

// Clone the test repo
const testRepo = path.resolve(__dirname, '..', 'spec', 'test-repo');
cliCmd('repos', ['add', testRepo, testRepoName]);

