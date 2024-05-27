import { db } from "../loaders/knex";
export default class TransactionsController {
  constructor() {}

  public async userTransactions(type, transaction_details, currentUser) {
    try {
      // check if wallet
      const walletExists = await db("wallet")
        .where("user_id", currentUser.id)
        .first();

      if (!walletExists) {
        throw new Error("Wallet not found");
      }

      const transaction_result = await db("transactions").insert([
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
      } else if (type == "withdrawal") {
        if (transaction_details.amount > walletExists.balance) {
          throw new Error("withdrawal is greater than wallet balance");
        }
        new_balance = walletExists.balance - transaction_details.amount;
      }

      // Update wallet details
      const update_wallet = await db("wallet")
        .where("user_id", currentUser.id)
        .update({
          balance: new_balance,
          updated_at: new Date(),
        });

      if (update_wallet) {
        await db("transactions").where("id", transactionId).update({
          status: "completed",
          updated_at: new Date(),
        });
      } else {
        await db("transactions").where("id", transactionId).update({
          status: "failed",
          updated_at: new Date(),
        });
      }

      // updated values after transactions

      const wallet = await db("wallet")
        .where("user_id", currentUser.id)
        .first();

      const transaction = await db("transactions")
        .where("id", transactionId)
        .first();

      return {
        status: "success",
        data: { wallet: wallet, transaction: transaction },
        message: "wallet funded successfully",
        code: 200,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  public async transferFunds(
    type,
    transaction_details,
    recipient_wallet_id,
    currentUser
  ) {
    const userWalletExists = await db("wallet")
      .where("user_id", currentUser.id)
      .first();

    if (!userWalletExists) {
      throw new Error("User wallet not found");
    }

    // check if receipient wallet exists
    const receipientWalletExists = await db("wallet")
      .where("id", recipient_wallet_id)
      .first();

    if (!receipientWalletExists) {
      throw new Error("Receipient wallet not found");
    }
    // create a transaction
    const transaction_result = await db("transactions").insert([
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
    const update_user_wallet = await db("wallet")
      .where("user_id", currentUser.id)
      .update({
        balance: new_user_balance,
        updated_at: new Date(),
      });
    // check if that works
    if (!update_user_wallet) {
      await db("transactions").where("id", transactionId).update({
        status: "failed",
        updated_at: new Date(),
      });
    }

    // add money to receipient wallet
    let new_receipient_balance;
    new_receipient_balance =
      receipientWalletExists.balance + transaction_details.amount;
    const update_receipient_wallet = await db("wallet")
      .where("id", recipient_wallet_id)
      .update({
        balance: new_receipient_balance,
        updated_at: new Date(),
      });
    // check if that works
    if (!update_receipient_wallet) {
      await db("transactions").where("id", transactionId).update({
        status: "failed",
        updated_at: new Date(),
      });
    }
    // complete transaction
    await db("transactions").where("id", transactionId).update({
      status: "completed",
      updated_at: new Date(),
    });

    // updated values after transactions

    const userWallet = await db("wallet")
      .where("user_id", currentUser.id)
      .first();

    const receipientWallet = await db("wallet")
      .where("id", recipient_wallet_id)
      .first();

    const transaction = await db("transactions")
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
    } catch (e) {
      throw new Error(e);
    }
  }
}
