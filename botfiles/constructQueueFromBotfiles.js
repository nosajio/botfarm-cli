const debug = require('debug')('botfarm:queue')
const { allBotfiles } = require('bots/fs');
const { nextRunTimes } = require('./times');
const queue = require('queue');

const constructQueueFromBotfiles = () => {
  // Iterate over bot dirs, then read all the entries in each botfile
  const botfiles = allBotfiles();
  const withNextRunTimes = Object.entries(botfiles).map(([farmName, bots]) => {
    const botsWithRunTimes = nextRunTimes(bots);
    queue.pushMany(botsWithRunTimes).then(pushRes => debug(pushRes));
  });
  // const botsWithRunTimes = botfiles.map(bf => );
}

module.exports = constructQueueFromBotfiles