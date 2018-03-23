#!/usr/bin/env node

require('dotenv').config();
const path = require('path');
const { spawn } = require('child_process');

const processConfig = {
  cwd: __dirname,
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

// Capture all the stdio and send to the current terminal
cliProcess.stdout.on('data', d => console.log(d.toString()));
cliProcess.stderr.on('data', d => console.error(d.toString()));