const debug = require('debug')('botfarm:fs:cache');
const error = require('debug')('botfarm:error:fs:cache');
const fs = require('fs');
const is = require('is_js');

const cacheDir = process.env.CACHE;
const queueFileName = 'bfQueueCache.json';


const newQueueFile = filename => {
  try {
    // Fresh queue file contains only an empty array so that it can be parsed
    // as JSON and have items pushed into it
    const fileContents = '[]';
    fs.writeFileSync(`${cacheDir}/${filename}`, fileContents, 'utf8');
    return fileContents;
  } catch(err) {
    throw err;
  }
}

/** 
 * Read the queue file, create it if it doesn't already exist 
 * @param {string} filename - the name of the queue file to return
 * @returns {object} queueJson
 */
const readQueueFile = (filename) => new Promise(resolve => {
  fs.readFile(`${cacheDir}/${filename}`, 'utf8', (err, fileData) => {
    // If an error is encountered it will probably be because the file can't be
    // found. To recover, create a new queue file and continue as normal
    if (err) {
      debug('Error reading queue file, creating a new one.');
      const fileContents = newQueueFile(filename);
      const fileJSON = JSON.parse(fileContents);
      return resolve(fileJSON);
    }
    try {
      const fileJSON = JSON.parse(fileData);
      resolve(fileJSON);
    } catch(err) {
      throw err;
    }
  });
});


const pushToQueue = async (filename, item) => {
  const queueArr = await readQueueFile(filename);
  if (is.not.array(queueArr)) {
    throw new Error('Queue didn\'t return an array');
  }
  queueArr.push(item);
  return item;
}

const searchQueueFile = async ({ before }) => {
  return [{}]
}

module.exports = {
  search: searchQueueFile,
  get: () => readQueueFile(queueFileName),
  deleteAll: () => { },
  take: () => { },
  push: item => pushToQueue(queueFileName, item),
}