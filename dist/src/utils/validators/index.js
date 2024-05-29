"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.validator = void 0;
const validatorjs_1 = __importDefault(require("validatorjs"));
const validator = (body, rules, customMessages, callback) => {
    const validation = new validatorjs_1.default(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};
exports.validator = validator;
const sendError = (res, err) => {
    const firstError = err.errors[Object.keys(err.errors)[0]][0];
    res.status(412).send({
        message: firstError,
        errors: err.errors,
        status: "error",
        code: 412,
    });
};
exports.sendError = sendError;
//# sourceMappingURL=index.js.map