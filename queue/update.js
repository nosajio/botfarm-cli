const error = require('debug')('botfarm:error:queue:update');
const debug = require('debug')('botfarm:queue:update');
const { times } = require('botfiles');
const pushToQueue = require('./push');

module.exports = {
  updateForBots: async bots => {
    if (! bots) {
      return null;
    }
    const withTimes = bots.map(bot =>( { ...bot, time: times.parseRunTime(bot.autorun)[0] }));
    const queueOps = withTimes.map(bot => pushToQueue(bot));
    const queueOpsResults = await Promise.all(queueOps);
    return queueOpsResults;
  }
}