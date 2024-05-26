import argon2 from "argon2";
import { db } from "../loaders/knex";
import { generateJwtToken } from "../utils/generateJwtToken";
export default class AuthController {
  constructor() {}

  public async createAccount(account_details) {
    try {
      // encrypt user password
      const hashedPassword = await argon2.hash(account_details.password);

      // save user details in db
      const result = await db("users").insert([
        {
          firstname: account_details.firstname,
          lastname: account_details.lastname,
          phone: account_details.phone,
          email: account_details.email,
          password: hashedPassword,
        },
      ]);

      const insertedId = result[0];

      const user = await db("users").where("id", insertedId).first();
      console.log("Inserted user:", user);

      // generate jwt token
      const jwt_token = await generateJwtToken(user);

      return {
        status: "success",
        data: { jwt_token, user: user },
        message: "account successfully created",
        code: 200,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  public async login(login_details) {
    try {
      // check whether user exists with email
      const userExists = await db("users")
        .where("email", login_details.email)
        .first();

      console.log("user", userExists);

      if (!userExists) {
        throw new Error("Invalid Email");
      }

      // validate the password
      const validPassword = await argon2.verify(
        userExists.password,
        login_details.password
      );

      if (!validPassword) {
        throw new Error("Invalid Password");
      }
      // generate token
      const jwt_token = await generateJwtToken(userExists);
      Reflect.deleteProperty(userExists, "password");

      return {
        status: "success",
        data: { jwt_token, user: userExists },
        message: "user login successfully created",
        code: 200,
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}
