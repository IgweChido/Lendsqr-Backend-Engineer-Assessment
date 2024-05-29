const knex = require("knex");
const environment = process.env.NODE_ENV || "development";
const knexConfig = require("../../knexfile")[environment];

export const db = knex(knexConfig);
export const dbLoader = () => {
  let status;
  // test tb connection
  db.raw("SELECT 1")
    .then(() => {
      console.log("Connection successful");
      status = "Connection successful";
    })
    .catch((err) => {
      console.error("Connection failed:", err);
      status = "Connection failed:" + err;
      process.exit(1);
    });

  return status;
};
