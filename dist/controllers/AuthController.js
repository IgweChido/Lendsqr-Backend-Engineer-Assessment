"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const knex_1 = require("../loaders/knex");
const generateJwtToken_1 = require("../utils/generateJwtToken");
const config_1 = __importDefault(require("../config"));
const checkKarmaForCustomers_1 = require("../utils/checkKarmaForCustomers");
class AuthController {
    constructor() { }
    createAccount(account_details) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check karma blacklist
                let karma;
                yield (0, checkKarmaForCustomers_1.checkKarmaForCustomer)(config_1.default.karmaUrl + account_details.email, config_1.default.authToken)
                    .then((data) => {
                    console.log("Fetched data:", data === null || data === void 0 ? void 0 : data.data);
                    // throw new Error("User cannot be Onboarded");
                    karma = data === null || data === void 0 ? void 0 : data.data;
                })
                    .catch((error) => {
                    var _a;
                    console.error("Error:", (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
                });
                console.log("karma", karma);
                if (karma) {
                    throw new Error("User cannot be Onboarded");
                }
                // encrypt user password
                const hashedPassword = yield argon2_1.default.hash(account_details.password);
                // save user details in db
                const result = yield (0, knex_1.db)("users").insert([
                    {
                        firstname: account_details.firstname,
                        lastname: account_details.lastname,
                        phone: account_details.phone,
                        email: account_details.email,
                        password: hashedPassword,
                    },
                ]);
                const insertedId = result[0];
                const user = yield (0, knex_1.db)("users").where("id", insertedId).first();
                console.log("Inserted user:", user);
                // add wallet information for the user
                const wallet_result = yield (0, knex_1.db)("wallet").insert([
                    {
                        balance: 0,
                        user_id: insertedId,
                    },
                ]);
                const walletId = wallet_result[0];
                const wallet = yield (0, knex_1.db)("wallet").where("id", walletId).first();
                // generate jwt token
                const jwt_token = yield (0, generateJwtToken_1.generateJwtToken)(user);
                return {
                    status: "success",
                    // data: { jwt_token, user: user, wallet: wallet },
                    message: "account successfully created",
                    code: 200,
                };
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    login(login_details) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check whether user exists with email
                const userExists = yield (0, knex_1.db)("users")
                    .where("email", login_details.email)
                    .first();
                console.log("user", userExists);
                if (!userExists) {
                    throw new Error("Invalid Email");
                }
                // validate the password
                const validPassword = yield argon2_1.default.verify(userExists.password, login_details.password);
                if (!validPassword) {
                    throw new Error("Invalid Password");
                }
                // generate token
                const jwt_token = yield (0, generateJwtToken_1.generateJwtToken)(userExists);
                Reflect.deleteProperty(userExists, "password");
                return {
                    status: "success",
                    data: { jwt_token, user: userExists },
                    message: "user login successfully created",
                    code: 200,
                };
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    getUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check whether user exists with email
                const userExists = {
                    id: 16,
                    firstname: "ifechukwusss",
                    lastname: "amaeze",
                    phone: "07037248310",
                    email: "amazing@yahoo.com",
                    password: "$argon2id$v=19$m=65536,t=3,p=4$T4A5vEEcDlbtNXEyO+/t6g$TWXwYkv1ABMG0nYkR1b3wMGyIs6GYULi4p+qFLAQy/0",
                    created_at: "2024-05-26T20:40:34.000Z",
                    updated_at: "2024-05-26T20:40:34.000Z",
                };
                return {
                    status: "success",
                    data: userExists,
                    message: "user fetched successfully",
                    code: 200,
                };
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map