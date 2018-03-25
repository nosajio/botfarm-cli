const debug = require('debug')('botfarm:renewQueue');
const error = require('debug')('botfarm:error:renewQueue');
const is = require('is_js');
const { reposWithBotfiles } = require('repos');
const { nextRunTimes } = require('botfiles/autorun');
const clearQueue = require('./clear');
const pushMany = require('./pushMany');

const renewQueue = async () => {
  // Clear the current queue
  try { await clearQueue(); } catch(err) { error(err); }
  const repos = await reposWithBotfiles();

  // When no repos have been added, just return an empty array and let the 
  // system handle it gracefully.
  if (is.empty(repos)) {
    return [];
  }
  
  const queueOps = repos.map(repo => {
    const botsWithRunTimes = nextRunTimes(repo.botfile);
    return pushMany(botsWithRunTimes, repo.id);
  });
  const queueOpsRes = await Promise.all(queueOps);
  return queueOpsRes;
}

module.exports = renewQueue