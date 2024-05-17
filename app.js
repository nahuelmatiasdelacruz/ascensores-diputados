console.clear();
const { knex } = require('./src/helpers/knexConfig');
const Server = require('./src/models/server');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const server = new Server();
server.listen();