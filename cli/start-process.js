const startService = require('service/start');

const start = () => {
  try {
    startService();  
  } catch(err) {
    throw err;
  }
}

start();