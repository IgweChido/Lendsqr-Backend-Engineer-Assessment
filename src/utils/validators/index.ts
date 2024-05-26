import Validator from "validatorjs";
export const validator = (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

export const sendError = (res, err) => {
  const firstError = err.errors[Object.keys(err.errors)[0]][0];

  res.status(412).send({
    message: firstError,
    errors: err.errors,
    status: "error",
    code: 412,
  });
};
