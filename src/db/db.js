const knex = require('knex');
const knexConfig = require('./config.js');

const db = knex(knexConfig.development);

module.exports = db;