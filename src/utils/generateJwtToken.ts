import config from "../config";
import jwt from "jsonwebtoken";

export async function generateJwtToken(user) {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      exp: exp.getTime() / 1000,
    },
    config.jwtSecret
  );
}
