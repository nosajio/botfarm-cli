const debug = require('debug')('botfarm:cli:listAction');
const error = require('debug')('botfarm:error:cli:listAction');
const Table = require('cli-table');
const is = require('is_js');
const path = require('path');
const { reposWithBotfiles } = require('core/repos');

/**
 * Output a list of repositories
 */
async function listRepos() {
  const repos = await reposWithBotfiles();
  if (is.empty(repos)) {
    return Promise.reject('No repositories available. Add one with "bots repos add http://url.to.repo local-name"');
  }
  // Use a table to display the repos
  const out = new Table({
    head: ['Repository', 'Bots'],
    colWidths: [30, 70],
  });
  const reposFormatted = repos.map(f => ({
    ...f,
    botsStr: Object.keys(f.botfile).join(', '),
  }));
  reposFormatted.forEach(f => {
    out.push([f.dir, f.botsStr]);
  })
  console.log(out.toString());
}

module.exports = listRepos;