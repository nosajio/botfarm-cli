# Botfarm CLI

[![Build Status](https://travis-ci.org/nosajio/botfarm-cli.svg?branch=master)](https://travis-ci.org/nosajio/botfarm-cli)

Like cron with superpowers. You can write scripts (or "bots") and tell them when to run. Botfarm takes care of setup, scheduling, and capturing logs.  

  - ⏲️   **Schedule**: Configure bots to run at specific times or at intervals.
  - 📺   **Console**: Observe bots and explore outputs.
  - 📦   **Git**: Sync your own repos of bots with botfarm to make updates easier.
  - 🏃‍♀️  **Easy**: No setup required, just add some bots and you're done!  

## Install

  - `npm install -g node-gyp`
  - `npm install -g botfarm-cli`

### Troubleshooting
Sometimes on certain Linux systems the above installs will fail with permission errors. To remedy this, you can re-install with the `--unsafe-perm` flag:  

`npm install -g --unsafe-perm=true node-gyp`  
`npm install -g --unsafe-perm=true --allow-root botfarm-cli`

Still having trouble? Submit an issue or ask [Jason](https://twitter.com/__nosaj) a question on twitter.

---

## Get started in 2 steps
Once `botfarm-cli` is installed, botfarm can be accessed through the `bots` command.

### 1) Add a repo
*Note: Make sure the repository can be cloned by the current machine. Invalid permissions will cause the add process to stall or fail.*

To add a new repository of bots to botfarm, simply run (replace the url and name with your own):  
`bots repo add http://url-to-repo repo-name`

### 2) Start the service
The background service must be running if you want bots to actually run. Start the service by running:  
`bots service start`

**Check if the service is running** with:  
`bots service status`

**Stop the service** by running:  
`bots service stop`

---

## Bot repo configuration
Botfarm isn't opinionated about the structure of repos. The only requirement is to have a `botfile.js` file in the root of the repo.

## The botfile
Every repo should have a botfile in its root. A botfile is a simple JS file that tells botfarm what to run and when to run it. It exports a function that returns an object containing bots. 

For example, let's say we have a repo containing two bots. One need's to be run every night at 12am, and the other runs on the hour every hour:

```Javascript
module.exports = () => ({
  'midnight-bot': {
    load: './run-me-at-midnight.js',
    autorun: '12am', // Tell the bot to run every midnight
  },

  'regular-bot': {
    load: './run-every-hour.js',
    autorun: ':00', // Tell the bot to run at every o'clock
  }
});
```

### Autorun strings
Botfarm understands multiple time formats for autorun strings.  

| Examples                                | Meanings                                    |
|-----------------------------------------|---------------------------------------------|
| `5 hours` or `1 minute` or `25 seconds` | Run the bot at specified intervals.         |
| `:10` or `:45`                          | Run the bot at the same time every hour.    |
| `3:15pm` or `8am`                       | Run the bot at a specific time every day.   |
| `2:30pm, 9pm`                           | Run the bot at 2:30pm and at 9pm every day. |

---

## The console
The botfarm console is the nerve center for your bots. With the console you can monitor the queue to see when bots are due. Monitor the history to see which bots ran successfully, which ones took a long time, and which ones failed. And see a stream of logs neatly organised by each bot.

Access the console by running:  
`bots console`

## The queue
Botfarm keeps an internal queue where it stores the time that each bot is next due to be run. To see the queue:  
`bots queue show`

Sometimes you might want to manually rebuild the queue. To rebuild the queue, run:  
`bots queue rebuild`

## Logs
Stream all logs with 
`bots logs --stream`

Show the last 50 errors
`bots logs -t stderr`

Show the last 50 logs
`bots logs -t stdout`

Show logs for a specific bot
`bots logs --bot repo/bot`

## Manually run a bot
You can manually run any bot at any time. There are two ways to do it: 

1) By default, if a bot is already queued, manually running it will remove it from the queue and re-add it after it's completed.
`bots run repo/bot`

2) The other option is to the bot independent of the queue. This leaves the queue alone and just runs the bot.
`bots run repo/bot --fork`


*Remaning docs coming soon. See bin/cli.js for all commands.*

## Update bot repos
### Delete a repo

---

## Contributions are encouraged 😃

