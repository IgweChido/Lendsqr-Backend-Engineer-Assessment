import { Router, Request, Response, NextFunction } from "express";
import TransactionsController from "../../controllers/TransactionsController";
import middlewares from "../middlewares";
import { validate_transactions } from "../../utils/validators/transactions_validator";

const route = Router();
export default (app: Router) => {
  app.use("/transactions", route);

  route.post(
    "/fund-account",
    validate_transactions,
    middlewares.isAuth,
    middlewares.attachCurrentUser,

    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const top_up_details = req.body;

        const transactionsController = new TransactionsController();
        const top_up_account = await transactionsController.userTransactions(
          "deposit",
          top_up_details,
          req["currentUser"]
        );

        res.status(200).json(top_up_account);
      } catch (err) {
        return next(err);
      }
    }
  );

  route.post(
    "/withdraw-funds",
    validate_transactions,
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const withdrawal_details = req.body;
        const transactionsController = new TransactionsController();
        const account_withdrawal =
          await transactionsController.userTransactions(
            "withdrawal",
            withdrawal_details,
            req["currentUser"]
          );

        res.status(200).json(account_withdrawal);
      } catch (err) {
        return next(err);
      }
    }
  );

  route.post(
    "/transfer-funds/:recipient_wallet_id",
    validate_transactions,
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const transfer_details = req.body;
        const recipient_wallet_id = req.params.recipient_wallet_id;
        const transactionsController = new TransactionsController();
        const account_transfer = await transactionsController.transferFunds(
          "transfer",
          transfer_details,
          recipient_wallet_id,
          req["currentUser"]
        );

        res.status(200).json(account_transfer);
      } catch (err) {
        return next(err);
      }
    }
  );
};
