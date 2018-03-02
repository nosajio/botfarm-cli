const debug = require('debug')('botfarm:queue')
const { allBotfiles } = require('filesystem');
const { nextRunTimes } = require('./times');
const queue = require('queue');

const constructQueueFromBotfiles = async () => {
  // Clear the current queue
  try { queue.clear(); } catch(err) { throw err; }
  // Iterate over bot dirs, then read all the entries in each botfile
  const botfiles = allBotfiles();
  const queueOps = Object.entries(botfiles).map(([farmName, bots]) => {
    const botsWithRunTimes = nextRunTimes(bots);
    return queue.pushMany(botsWithRunTimes);
  });
  const queueOpsRes = await Promise.all(queueOps);
  return queueOpsRes;
}

module.exports = constructQueueFromBotfiles