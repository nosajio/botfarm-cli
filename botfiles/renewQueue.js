const debug = require('debug')('botfarm:queue')
const { farmsWithBotfiles } = require('farms');
const { nextRunTimes } = require('./times');
const queue = require('queue');

const constructQueueFromBotfiles = async () => {
  // Clear the current queue
  try { queue.clear(); } catch(err) { throw err; }
  const farms = await farmsWithBotfiles();
  const queueOps = farms.map(farm => {
    const botsWithRunTimes = nextRunTimes(farm.botfile);
    return queue.pushMany(botsWithRunTimes, farm.id);
  });
  const queueOpsRes = await Promise.all(queueOps);
  return queueOpsRes;
}

module.exports = constructQueueFromBotfiles