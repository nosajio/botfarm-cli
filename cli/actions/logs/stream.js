const debug = require('debug')('botfarm:cli:streamLogs');
const error = require('debug')('botfarm:error:cli:streamLogs');
const { Readable } = require('stream');
const is = require('is_js');
const db = require('db');
const { formatLogEntry } = require('./fmt');

// Used for keeping track of the last log that was streamed. This will put less 
// load on the db because only the new logs will have to be returned.
let streamMarker;
// Configure the read stream
const readStream = new Readable;
readStream._read = size => { };


const poll = ms => new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, ms);
});


/**
 * Stream all items with ids > the id argument to the passed writable stream
 * @param {number} id_gt stream all items > this id
 * @param {WritableStream} writeStream
 * @return {number} latestId
 */
async function streamGtId(id_gt, writeStream) {
  const rows = await db.outputs.search({ id_gt });
  // When no new logs are available, return the same id that was passed in so 
  // the caller can try again at a later time
  if (!rows.length) {
    return id_gt;
  }
  rows.forEach(log => {
    const logString = formatLogEntry(log);
    readStream.push(logString);
  });
  readStream.pipe(writeStream);
  // Return the last id
  return rows[rows.length - 1].id;
}


async function streamLogs(botName, opts) {
  if (!streamMarker) {
    // Before the stream can begin, the app needs to know the last id in the table
    // so that it can easily query for new ids
    const seedResult = await db.outputs.all(1);
    // In the eventuality that there are no logs in the db to start with, 
    // just start looking from id 0
    if (is.object(seedResult)) {
      streamMarker = seedResult[0].id;
    } else {
      streamMarker = 0;
    }
  }
  streamMarker = await streamGtId(streamMarker, process.stdout);
  // Wait then run this func again to give the illusion of live output... cheeky
  await poll(1000);
  streamLogs(botName, opts);
}

module.exports = streamLogs;