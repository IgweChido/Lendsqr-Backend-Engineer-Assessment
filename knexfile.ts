import config from "./src/config";

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: config.databaseHost,
      port: config.databasePort,
      user: config.databaseUser,
      password: config.databasePassword,
      database: config.databaseName,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
