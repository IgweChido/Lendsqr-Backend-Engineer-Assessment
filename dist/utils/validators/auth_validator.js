"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_create_account = exports.validate_login = void 0;
const index_1 = require("./index");
const validate_login = (req, res, next) => {
    const validationRule = {
        email: "required|string",
        password: "required|string",
    };
    (0, index_1.validator)(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            (0, index_1.sendError)(res, err);
        }
        else {
            next();
        }
    });
};
exports.validate_login = validate_login;
const validate_create_account = (req, res, next) => {
    const validationRule = {
        firstname: "required|string",
        lastname: "required|string",
        email: "required|string",
        phone: "required|string",
        password: "required|string|min:6",
    };
    (0, index_1.validator)(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            (0, index_1.sendError)(res, err);
        }
        else {
            next();
        }
    });
};
exports.validate_create_account = validate_create_account;
//# sourceMappingURL=auth_validator.js.map