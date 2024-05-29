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
const chai_1 = __importDefault(require("chai"));
const chai_2 = require("chai");
const chai_http_1 = __importDefault(require("chai-http"));
const express = require("express");
const knex_1 = require("../src/loaders/knex");
const setup_spec_1 = __importDefault(require("./setup.spec"));
chai_1.default.use(chai_http_1.default);
describe("Transactions controller", () => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    let currentUser;
    const transactionDetails = {
        amount: 100,
    };
    it("Login to account", function (done) {
        chai_1.default
            .request(setup_spec_1.default)
            .post("/api/auth/login")
            .send({
            email: "test@example.com",
            password: "password123",
        })
            .end((err, res) => {
            token = res.body.data.jwt_token;
            currentUser = res.body.data.user;
            (0, chai_2.expect)(res.status).to.be.equal(200);
            (0, chai_2.expect)(res.body).to.be.a("object");
            (0, chai_2.expect)(res.body.error).to.be.equal(undefined);
            done();
        });
    });
    it("fund an account", function (done) {
        // Fetch the wallet balance before the transaction
        (0, knex_1.db)("wallet")
            .where("user_id", currentUser.id)
            .first()
            .then((wallet) => {
            const initialBalance = wallet.balance;
            const transactionDetails = {
                amount: 100,
            };
            const expectedBalance = initialBalance + transactionDetails.amount;
            // Perform the transaction
            chai_1.default
                .request(setup_spec_1.default)
                .post("/api/transactions/fund-account")
                .set("Authorization", `Bearer ${token}`)
                .send(transactionDetails)
                .end((err, res) => {
                if (err)
                    return done(err);
                (0, chai_2.expect)(res.status).to.be.equal(200);
                (0, chai_2.expect)(res.body).to.be.a("object");
                (0, chai_2.expect)(res.body.data.wallet.balance).to.be.equal(expectedBalance);
                (0, chai_2.expect)(res.body.error).to.be.equal(undefined);
                done();
            });
        })
            .catch(done);
    });
    it("withdraw from account", function (done) {
        // Fetch the wallet balance before the transaction
        (0, knex_1.db)("wallet")
            .where("user_id", currentUser.id)
            .first()
            .then((wallet) => {
            const initialBalance = wallet.balance;
            const transactionDetails = {
                amount: 100,
            };
            const expectedBalance = initialBalance - transactionDetails.amount;
            // Perform the transaction
            chai_1.default
                .request(setup_spec_1.default)
                .post("/api/transactions/withdraw-funds")
                .set("Authorization", `Bearer ${token}`)
                .send(transactionDetails)
                .end((err, res) => {
                if (err)
                    return done(err);
                (0, chai_2.expect)(res.status).to.be.equal(200);
                (0, chai_2.expect)(res.body).to.be.a("object");
                (0, chai_2.expect)(res.body.data.wallet.balance).to.be.equal(expectedBalance);
                (0, chai_2.expect)(res.body.error).to.be.equal(undefined);
                done();
            });
        })
            .catch(done);
    });
    it("transfer to a user's account", function () {
        return __awaiter(this, void 0, void 0, function* () {
            // Transaction details
            const transactionDetails = {
                amount: 100,
            };
            // Fetch the sender's wallet balance before the transaction
            const user_wallet = yield (0, knex_1.db)("wallet")
                .where("user_id", currentUser.id)
                .first();
            const initialUsersBalance = user_wallet.balance;
            const expectedSendersBalance = initialUsersBalance - transactionDetails.amount;
            // Fetch the recipient's wallet balance before the transaction
            const receipient_wallet_id = 25;
            const receipient_wallet = yield (0, knex_1.db)("wallet")
                .where("id", receipient_wallet_id)
                .first();
            const initialReceipientsBalance = receipient_wallet.balance;
            const expectedReceipientBalance = initialReceipientsBalance + transactionDetails.amount;
            // Perform the transaction
            const res = yield chai_1.default
                .request(setup_spec_1.default)
                .post(`/api/transactions/transfer-funds/${receipient_wallet_id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(transactionDetails);
            // Assertions
            (0, chai_2.expect)(res.status).to.be.equal(200);
            (0, chai_2.expect)(res.body).to.be.a("object");
            (0, chai_2.expect)(res.body.data.userWallet.balance).to.be.equal(expectedSendersBalance);
            (0, chai_2.expect)(res.body.data.receipientWallet.balance).to.be.equal(expectedReceipientBalance);
            (0, chai_2.expect)(res.body.error).to.be.equal(undefined);
        });
    });
}));
//# sourceMappingURL=transactions.spec.js.map