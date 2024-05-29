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
const chai_1 = __importDefault(require("chai"));
const chai_2 = require("chai");
const chai_http_1 = __importDefault(require("chai-http"));
const express = require("express");
const setup_spec_1 = __importDefault(require("./setup.spec"));
chai_1.default.use(chai_http_1.default);
describe("Auth controller", () => __awaiter(void 0, void 0, void 0, function* () {
    const accountDetails = {
        firstname: "John",
        lastname: "Doe",
        phone: "1234567890",
        email: "test@example.com",
        password: "password123",
    };
    it("Create an account", function (done) {
        this.timeout(5000);
        chai_1.default
            .request(setup_spec_1.default)
            .post("/api/auth/create-account")
            .send(accountDetails)
            .end((err, res) => {
            (0, chai_2.expect)(res.status).to.be.equal(200);
            (0, chai_2.expect)(res.body).to.be.a("object");
            (0, chai_2.expect)(res.body.error).to.be.equal(undefined);
            done();
        });
    });
}));
//# sourceMappingURL=auth.spec.js.map