import config from "../config";
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
  },
};
