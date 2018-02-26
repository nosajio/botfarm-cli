const { allBotfiles } = require('bots/fs');

const constructQueueFromBotfiles = () => {
  // Iterate over bot dirs, then read all the entries in each botfile
  const bots = allBotfiles();
}

module.exports = constructQueueFromBotfiles