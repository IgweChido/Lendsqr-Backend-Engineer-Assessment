"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TransactionsController_1 = __importDefault(require("../../controllers/TransactionsController"));
const middlewares_1 = __importDefault(require("../middlewares"));
const transactions_validator_1 = require("../../utils/validators/transactions_validator");
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use("/transactions", route);
    route.post("/fund-account", transactions_validator_1.validate_transactions, middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const top_up_details = req.body;
            const transactionsController = new TransactionsController_1.default();
            const top_up_account = yield transactionsController.userTransactions("deposit", top_up_details, req["currentUser"]);
            res.status(200).json(top_up_account);
        }
        catch (err) {
            return next(err);
        }
    }));
    route.post("/withdraw-funds", transactions_validator_1.validate_transactions, middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const withdrawal_details = req.body;
            const transactionsController = new TransactionsController_1.default();
            const account_withdrawal = yield transactionsController.userTransactions("withdrawal", withdrawal_details, req["currentUser"]);
            res.status(200).json(account_withdrawal);
        }
        catch (err) {
            return next(err);
        }
    }));
    route.post("/transfer-funds/:recipient_wallet_id", transactions_validator_1.validate_transactions, middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transfer_details = req.body;
            const recipient_wallet_id = req.params.recipient_wallet_id;
            const transactionsController = new TransactionsController_1.default();
            const account_transfer = yield transactionsController.transferFunds("transfer", transfer_details, recipient_wallet_id, req["currentUser"]);
            res.status(200).json(account_transfer);
        }
        catch (err) {
            return next(err);
        }
    }));
};
//# sourceMappingURL=transactions.js.map