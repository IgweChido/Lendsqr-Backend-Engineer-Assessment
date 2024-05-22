const dotenv = require("dotenv").config();

const envfound = dotenv;
if (envfound.error) {
  
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
export default {
  port: parseInt(process.env.PORT, 10),

  databaseURL: process.env.DB_URI,
};
