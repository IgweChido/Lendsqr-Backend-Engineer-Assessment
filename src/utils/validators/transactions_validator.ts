import { validator, sendError } from "./index";

export const validate_transactions = (req, res, next) => {
  const validationRule = {
    amount: "required|number|min:1",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      sendError(res, err);
    } else {
      next();
    }
  });
};
