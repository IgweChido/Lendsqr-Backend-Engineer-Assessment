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
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = require("../loaders/knex");
class TransactionsController {
    constructor() { }
    userTransactions(type, transaction_details, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if wallet
                const walletExists = yield (0, knex_1.db)("wallet")
                    .where("user_id", currentUser.id)
                    .first();
                if (!walletExists) {
                    throw new Error("Wallet not found");
                }
                const transaction_result = yield (0, knex_1.db)("transactions").insert([
                    {
                        type: type,
                        wallet_id: walletExists.id,
                        status: "pending",
                        amount: transaction_details.amount,
                        description: `${type} into account`,
                    },
                ]);
                const transactionId = transaction_result[0];
                let new_balance;
                if (type == "deposit") {
                    new_balance = walletExists.balance + transaction_details.amount;
                }
                else if (type == "withdrawal") {
                    if (transaction_details.amount > walletExists.balance) {
                        throw new Error("withdrawal is greater than wallet balance");
                    }
                    new_balance = walletExists.balance - transaction_details.amount;
                }
                // Update wallet details
                const update_wallet = yield (0, knex_1.db)("wallet")
                    .where("user_id", currentUser.id)
                    .update({
                    balance: new_balance,
                    updated_at: new Date(),
                });
                if (update_wallet) {
                    yield (0, knex_1.db)("transactions").where("id", transactionId).update({
                        status: "completed",
                        updated_at: new Date(),
                    });
                }
                else {
                    yield (0, knex_1.db)("transactions").where("id", transactionId).update({
                        status: "failed",
                        updated_at: new Date(),
                    });
                }
                // updated values after transactions
                const wallet = yield (0, knex_1.db)("wallet")
                    .where("user_id", currentUser.id)
                    .first();
                const transaction = yield (0, knex_1.db)("transactions")
                    .where("id", transactionId)
                    .first();
                return {
                    status: "success",
                    data: { wallet: wallet, transaction: transaction },
                    message: "wallet funded successfully",
                    code: 200,
                };
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    transferFunds(type, transaction_details, recipient_wallet_id, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const userWalletExists = yield (0, knex_1.db)("wallet")
                .where("user_id", currentUser.id)
                .first();
            if (!userWalletExists) {
                throw new Error("User wallet not found");
            }
            // check if receipient wallet exists
            const receipientWalletExists = yield (0, knex_1.db)("wallet")
                .where("id", recipient_wallet_id)
                .first();
            if (!receipientWalletExists) {
                throw new Error("Receipient wallet not found");
            }
            // create a transaction
            const transaction_result = yield (0, knex_1.db)("transactions").insert([
                {
                    type: type,
                    wallet_id: userWalletExists.id,
                    transferred_to: receipientWalletExists.id,
                    status: "pending",
                    amount: transaction_details.amount,
                    description: `${type} from account`,
                },
            ]);
            const transactionId = transaction_result[0];
            let new_user_balance;
            // remove amount from wallet
            if (transaction_details.amount > userWalletExists.balance) {
                throw new Error("withdrawal is greater than wallet balance");
            }
            new_user_balance = userWalletExists.balance - transaction_details.amount;
            // Update wallet details
            const update_user_wallet = yield (0, knex_1.db)("wallet")
                .where("user_id", currentUser.id)
                .update({
                balance: new_user_balance,
                updated_at: new Date(),
            });
            // check if that works
            if (!update_user_wallet) {
                yield (0, knex_1.db)("transactions").where("id", transactionId).update({
                    status: "failed",
                    updated_at: new Date(),
                });
            }
            // add money to receipient wallet
            let new_receipient_balance;
            new_receipient_balance =
                receipientWalletExists.balance + transaction_details.amount;
            const update_receipient_wallet = yield (0, knex_1.db)("wallet")
                .where("id", recipient_wallet_id)
                .update({
                balance: new_receipient_balance,
                updated_at: new Date(),
            });
            // check if that works
            if (!update_receipient_wallet) {
                yield (0, knex_1.db)("transactions").where("id", transactionId).update({
                    status: "failed",
                    updated_at: new Date(),
                });
            }
            // complete transaction
            yield (0, knex_1.db)("transactions").where("id", transactionId).update({
                status: "completed",
                updated_at: new Date(),
            });
            // updated values after transactions
            const userWallet = yield (0, knex_1.db)("wallet")
                .where("user_id", currentUser.id)
                .first();
            const receipientWallet = yield (0, knex_1.db)("wallet")
                .where("id", recipient_wallet_id)
                .first();
            const transaction = yield (0, knex_1.db)("transactions")
                .where("id", transactionId)
                .first();
            try {
                return {
                    status: "success",
                    data: {
                        userWallet: userWallet,
                        receipientWallet: receipientWallet,
                        transaction: transaction,
                    },
                    message: "account successfully created",
                    code: 200,
                };
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
}
exports.default = TransactionsController;
//# sourceMappingURL=TransactionsController.js.map