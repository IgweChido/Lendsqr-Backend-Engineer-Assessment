"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbLoader = exports.db = void 0;
const knex = require("knex");
const environment = process.env.NODE_ENV || "development";
const knexConfig = require("../../knexfile")[environment];
exports.db = knex(knexConfig);
const dbLoader = () => {
    let status;
    // test tb connection
    exports.db.raw("SELECT 1")
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
exports.dbLoader = dbLoader;
//# sourceMappingURL=knex.js.map