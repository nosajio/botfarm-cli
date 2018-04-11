const error = require('debug')('botfarm:error:queue:update');
const debug = require('debug')('botfarm:queue:update');
const { autorun } = require('core/botfiles');
const pushToQueue = require('./push');

const updateForBots = async bots => {
  if (!bots) {
    return null;
  }
  const withTimes = bots.map(bot => ({ ...bot, time: autorun.parseRunTime(bot.autorun)[0] }));
  const queueOps = withTimes.map(bot => pushToQueue(bot));
  const queueOpsResults = await Promise.all(queueOps);
  return queueOpsResults;
}

module.exports = updateForBots;