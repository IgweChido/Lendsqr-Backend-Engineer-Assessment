import { Router, Request, Response, NextFunction } from "express";
import AuthController from "../../controllers/AuthController";
import {
  validate_create_account,
  validate_login,
} from "../../utils/validators/auth_validator";
const route = Router();
export default (app: Router) => {
  app.use("/auth", route);

  route.post(
    "/create-account",
    validate_create_account,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const account_details = req.body;
        const authController = new AuthController();
        const create_user_account = await authController.createAccount(
          account_details
        );

        res.status(200).json(create_user_account);
      } catch (err) {
        return next(err);
      }
    }
  );

  route.post(
    "/login",
    validate_login,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const login_details = req.body;
        const authController = new AuthController();
        const login_to_account = await authController.login(login_details);
        res.status(200).json(login_to_account);
      } catch (err) {
        return next(err);
      }
    }
  );

  route.get(
    "/get-user/:id",

    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params.id;
        const authController = new AuthController();
        const get_user = await authController.getUser(id);
        res.status(200).json(get_user);
      } catch (err) {
        return next(err);
      }
    }
  );
};
