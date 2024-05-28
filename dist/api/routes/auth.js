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
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../../controllers/AuthController"));
const auth_validator_1 = require("../../utils/validators/auth_validator");
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use("/auth", route);
    route.post("/create-account", auth_validator_1.validate_create_account, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const account_details = req.body;
            const authController = new AuthController_1.default();
            const create_user_account = yield authController.createAccount(account_details);
            res.status(200).json(create_user_account);
        }
        catch (err) {
            return next(err);
        }
    }));
    route.post("/login", auth_validator_1.validate_login, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const login_details = req.body;
            const authController = new AuthController_1.default();
            const login_to_account = yield authController.login(login_details);
            res.status(200).json(login_to_account);
        }
        catch (err) {
            return next(err);
        }
    }));
};
//# sourceMappingURL=auth.js.map