"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv").config();
const envfound = dotenv;
if (envfound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
exports.default = {
    port: parseInt(process.env.PORT, 10),
    databasePort: parseInt(process.env.DB_PORT, 10),
    databasePassword: process.env.DB_PASSWORD,
    databaseName: process.env.DB_NAME,
    databaseUser: process.env.DB_USER,
    databaseHost: process.env.DB_HOST,
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: process.env.JWT_ALGO,
    karmaUrl: process.env.KARMA_URL,
    authToken: process.env.AUTH_TOKEN,
};
//# sourceMappingURL=index.js.map