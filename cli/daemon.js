const debug = require('debug')('botfarm:cli:daemon');
const error = require('debug')('botfarm:error:cli:daemon');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const is = require('is_js');

// Setup all the paths
const rootPath = path.resolve(__dirname, '..');
// Relative to NODE_PATH env variable (should be set to app root)
const startScriptPath = path.join(rootPath, 'cli', 'start-process.js');
// Logs dirs
const logsRootPath = path.join(rootPath, process.env.LOGS);
const logPaths = {
  stdout: path.join(logsRootPath, 'botfarm_stdout.log'),
  stderr: path.join(logsRootPath, 'botfarm_stderr.log'),  
}
// Where to store the PID
const pidPath = path.join(rootPath, process.env.USERDATA, 'pid');


/**
 * Start daemon by spawning a new process to run the app from within. 
 * When the child process has spawned, its pid will be stored so that
 * the process can be stopped later.
 */
function startDaemon() {
  if (is.not.null( getPid() )) {
    console.log('Daemon is already running!');
    return;
  }
  resetLogs();
  const stdout = fs.openSync(logPaths.stdout, 'a');
  const stderr = fs.openSync(logPaths.stderr, 'a');
  debug(startScriptPath)
  const backgroundProcess = spawn(process.execPath, [startScriptPath], {
    stdio: ['ipc', stdout, stderr],
    detached: true,
    env: process.env
  });
  backgroundProcess.unref();
  const { pid } = backgroundProcess;
  storePid(pid);
}

/**
 * Stop the child process by retrieving the pid from disk and killing 
 * the process. Throws if no process is running.
 */
function stopDaemon() {
  const pid = getPid();
  if (pid) {
    clearPid();
    // Attempt to kill the process
    try {
      process.kill(parseInt(pid));
    } catch(err) {
      throw err;
    }
  } else {
    throw new Error('Couldn\'t stop daemon as it isn\'t running (no pid)');
  }
}

/**
 * Clear the log files in logPaths. useful to run on boot to clear out previous 
 * session's logs.
 */
function resetLogs() {
  Object.entries(logPaths).forEach(([type, path]) => {
    fs.unlinkSync(path);
  });
}

/**
 * Store pid of child process
 * @param {number|string} pid 
 */
function storePid(pid) {
  fs.writeFileSync(pidPath, String(pid));
}

/**
 * Get the pid for the child process. Returns null if pid is not present
 */
function getPid() {
  try {
    const pidData = fs.readFileSync(pidPath, 'utf8');
    return pidData;
  } catch(err) {
    return null;
  }
}

/**
 * Return a string containing the running status of the daemon
 */
function deamonStatus() {
  const runningStr = 'Botfarm daemon is running.'
  const notRunningStr = 'Botfarm daemon is stopped.'
  const pid = getPid();
  return pid ? runningStr : notRunningStr;
}

/**
 * Remove the pid file to avoid accitental destruction of other processes
 */
function clearPid() {
  fs.unlinkSync(pidPath);
}

module.exports = { status: deamonStatus, start: startDaemon, stop: stopDaemon };