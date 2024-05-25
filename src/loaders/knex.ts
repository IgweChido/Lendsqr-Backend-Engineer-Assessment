const knex = require("knex");
const knexConfig = require("../../knexfile");

const db = knex(knexConfig);
export const dbLoader = () => {
  let status;
  // test tb connection
  db.raw("SELECT 1")
    .then(() => {
      console.log("Connection successful");
      status = "Connection successful";
      process.exit(0);
    })
    .catch((err) => {
      console.error("Connection failed:", err);
      status = "Connection failed:" + err;
      process.exit(1);
    });

  return status;
};
