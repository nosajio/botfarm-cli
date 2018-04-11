const { queue } = require('core/db');

const clear = () => queue.deleteAll();

module.exports = clear;