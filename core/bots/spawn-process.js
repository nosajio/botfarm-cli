const is = require('is_js');

/**
 * This file contains the toolkit for taking from the queue and running bots 
 */

const { BOT } = process.env;

const spawnBotProcess = bot => {
  let botPayload;
  
  if (is.not.string(bot)) {
    throw new TypeError('process.env.BOT should be a string, instead got %s', typeof bot);
  }

  // Attempt to parse the JSON env payload
  try {
    botPayload = JSON.parse(bot);
  } catch(err) {
    throw new Error('Bot payload must be a valid JSON string');
  }
  
  // Attempt to load the bot
  try {
    require(botPayload.loader);
  } catch(err) {
    throw err;
  }
}

spawnBotProcess(BOT);