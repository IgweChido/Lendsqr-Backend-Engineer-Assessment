import { validator, sendError } from "./index";

export const validate_login = (req, res, next) => {
  const validationRule = {
    email: "required|string",
    password: "required|string",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      sendError(res, err);
    } else {
      next();
    }
  });
};

export const validate_create_account = (req, res, next) => {
  const validationRule = {
    firstname: "required|string",
    lastname: "required|string",
    email: "required|string",
    phone: "required|string",
    password: "required|string|min:6",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      sendError(res, err);
    } else {
      next();
    }
  });
};
