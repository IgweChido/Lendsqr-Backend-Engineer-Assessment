"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { expressjwt: jwt } = require("express-jwt");
const config_1 = __importDefault(require("../../config"));
const getTokenFromHeader = (req) => {
    if ((req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Token") ||
        (req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer")) {
        return req.headers.authorization.split(" ")[1];
    }
    return null;
};
const isAuth = jwt({
    secret: config_1.default.jwtSecret,
    algorithms: [config_1.default.jwtAlgorithm],
    requestProperty: "token",
    getToken: getTokenFromHeader,
});
exports.default = isAuth;
//# sourceMappingURL=isAuth.js.map