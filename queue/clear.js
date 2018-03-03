const queueCache = require('filesystem').cache.queue;

const clear = () => queueCache.deleteAll();

module.exports = clear;