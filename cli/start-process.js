const startService = require('core/service/start');

const start = () => {
  try {
    startService();  
  } catch(err) {
    throw err;
  }
}

start();