// import Logger from './logger'
import expressLoader from "./express";
import { dbLoader } from "./knex";

// const knex = require("knex");
// const knexConfig = require("./knex");

export default async ({ expressApp }) => {
  await expressLoader({ app: expressApp });

  dbLoader();
};
