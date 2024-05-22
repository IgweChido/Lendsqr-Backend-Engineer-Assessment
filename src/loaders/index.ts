// import Logger from './logger'
import expressLoader from "./express";
const knex = require("knex");
const knexConfig = require("./knex");

export default async ({ expressApp }) => {
  await expressLoader({ app: expressApp });

  // initialize Knex in app/export db instance
  const db = knex(knexConfig.development);
  // test tb connection
  db.raw("SELECT 1")
    .then(() => {
      console.log("Connection successful");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Connection failed:", err);
      process.exit(1);
    });
  module.exports = db;
};
