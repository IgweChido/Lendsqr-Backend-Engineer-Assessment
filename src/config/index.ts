const dotenv = require("dotenv").config();

const envfound = dotenv;
if (envfound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
export default {
  port: parseInt(process.env.PORT, 10),

  databasePort: parseInt(process.env.DB_PORT, 10),
  databasePassword: process.env.DB_PASSWORD,
  databaseName: process.env.DB_NAME,
  databaseUser: process.env.DB_USER,
  databaseHost: process.env.DB_HOST,

  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGO,
  karmaUrl: process.env.KARMA_API_URL,
  authToken: process.env.KARMA_API_TOKEN,
};
