const botfarm = require('../');

const start = () => {
  try {
    botfarm.start();  
  } catch(err) {
    throw err;
  }
}

start();