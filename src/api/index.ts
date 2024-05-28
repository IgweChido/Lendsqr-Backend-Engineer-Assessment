import { Router } from "express";
import auth from "./routes/auth";
import transactions from "./routes/transactions";
export default () => {
  const app = Router();
  auth(app);
  transactions(app);

  return app;
};
