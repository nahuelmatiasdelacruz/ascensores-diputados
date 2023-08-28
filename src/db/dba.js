const {Pool} = require("pg");

const pool = new Pool({
    host: "200.58.123.214",
    port: 5432,
    database: "sgp_desa",
    user: "sgp_user",
    password: "Us3r_SGP_432%"
})

module.exports = pool;