import argon2 from "argon2";
import { db } from "../loaders/knex";
import { generateJwtToken } from "../utils/generateJwtToken";
import config from "../config";
import { checkKarmaForCustomer } from "../utils/checkKarmaForCustomers";
export default class AuthController {
  constructor() {}

  public async createAccount(account_details) {
    try {
      // Check karma blacklist
      let karma;
      await checkKarmaForCustomer(
        config.karmaUrl + account_details.email,
        config.authToken
      )
        .then((data) => {
          console.log("Fetched data:", data?.data);
          // throw new Error("User cannot be Onboarded");
          karma = data?.data;
        })
        .catch((error) => {
          console.error("Error:", error?.response?.data);
        });

      // console.log("karma", karma);

      if (karma) {
        throw new Error("User cannot be Onboarded");
      }

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
      // console.log("Inserted user:", user);

      // add wallet information for the user
      const wallet_result = await db("wallet").insert([
        {
          balance: 0,
          user_id: insertedId,
        },
      ]);
      const walletId = wallet_result[0];

      const wallet = await db("wallet").where("id", walletId).first();

      // generate jwt token
      const jwt_token = await generateJwtToken(user);

      return {
        status: "success",
        // data: { jwt_token, user: user, wallet: wallet },
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

      // console.log("user", userExists);

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
        message: "user login successfull",
        code: 200,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  // to test my hoster app
  public async getUser() {
    try {
      // check whether user exists with email
      const userExists = {
        id: 16,
        firstname: "ifechukwusss",
        lastname: "amaeze",
        phone: "07037248310",
        email: "amazing@yahoo.com",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$T4A5vEEcDlbtNXEyO+/t6g$TWXwYkv1ABMG0nYkR1b3wMGyIs6GYULi4p+qFLAQy/0",
        created_at: "2024-05-26T20:40:34.000Z",
        updated_at: "2024-05-26T20:40:34.000Z",
      };

      return {
        status: "success",
        data: userExists,
        message: "user fetched successfully",
        code: 200,
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}
