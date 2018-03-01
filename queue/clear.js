const queueTable = require('db').queue;

const clear = () => queueTable.deleteAll();

module.exports = clear;