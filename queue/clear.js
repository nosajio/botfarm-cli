const { queue } = require('db');

const clear = () => queue.deleteAll();

module.exports = clear;