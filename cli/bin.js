#!/usr/bin/env node

const debug = require('debug')('botfarm:cli:bin');
const path = require('path');
const { spawn } = require('child_process');

const processConfig = {
  cwd: __dirname,
  // Capture all the stdio and send to the current terminal
  stdio: [process.stdin, process.stdout, process.stderr],
  env: {
    ...process.env,
    NODE_PATH: path.resolve(__dirname, '..'),
  }
}

// Spawn the cli script inside of a new process so that certain env variables
// can be set and passed to the script
const cliProcess = spawn(
  'node', 
  ['./cli.js', ...process.argv.slice(2)], 
  processConfig
);