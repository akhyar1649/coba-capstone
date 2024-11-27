const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage();

module.exports = storage;