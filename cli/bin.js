#!/usr/bin/env node

const debug = require('debug')('botfarm:cli:bin');
const path = require('path');
const { spawn } = require('child_process');

// Load environment vars from the .env file located in the parent directory
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

debug(path.resolve(__dirname, '..') );

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
cliProcess.stdout.on('data', d => process.stdout.write(d.toString()));
cliProcess.stderr.on('data', d => process.stderr.write(d.toString()));