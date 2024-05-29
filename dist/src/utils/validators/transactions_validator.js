"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_transactions = void 0;
const index_1 = require("./index");
const validate_transactions = (req, res, next) => {
    const validationRule = {
        amount: "required|integer|min:1",
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
exports.validate_transactions = validate_transactions;
//# sourceMappingURL=transactions_validator.js.map