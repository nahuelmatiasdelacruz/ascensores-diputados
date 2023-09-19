module.exports = {
    development: {
      client: 'pg',
      connection: {
        host: "process.env.DBHOST",
        user: "process.env.DBUSER",
        password: "process.env.DBPASSWORD",
        database: "sgp_desa",
        port: 5432,
      }
    },
  };
