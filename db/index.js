const debug = require('debug')('botfarm:db');
const { Client } = require('pg');

let db = new Client();

const connect = async () => {
  await db.connect();
  debug('Established db connection')
}

module.exports = {
  connect,
  farms:   require('./farms')(db),
  history: require('./history')(db),
  outputs: require('./outputs')(db),
  queue:   require('./queue')(db),
}

