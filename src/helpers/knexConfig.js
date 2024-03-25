const knex2 = require('knex')({
  client: 'pg',
    connection: {
      host: "200.58.123.214",
      user: "sgp_user",
      password: "Us3r_SGP_432%",
      database: "sgp_desa",
      port: 5432,
    }
});
const knex = require('knex')({
  client: 'pg',
    connection: {
      host: "127.0.0.1",
      user: "sgp_user",
      password: "Us3r_SGP_432%",
      database: "sgp",
      port: 5432,
    }
});

module.exports = {knex};