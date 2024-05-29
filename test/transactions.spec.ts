import chai from "chai";
import { expect } from "chai";
import chaiHttp from "chai-http";
const express = require("express");
import jwt from "jsonwebtoken";

import loaders from "../src/loaders";
import { generateJwtToken } from "../src/utils/generateJwtToken";
import config from "../src/config";
import { db } from "../src/loaders/knex";
import exp from "constants";
import app from "./setup.spec";

chai.use(chaiHttp);

describe("Transactions controller", async () => {
  let token;
  let currentUser;
  const transactionDetails = {
    amount: 100,
  };

  it("Login to account", function (done) {
    chai
      .request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "password123",
      })
      .end((err, res) => {
        token = res.body.data.jwt_token;
        currentUser = res.body.data.user;
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(undefined);

        done();
      });
  });

  it("fund an account", function (done) {
    // Fetch the wallet balance before the transaction
    db("wallet")
      .where("user_id", currentUser.id)
      .first()
      .then((wallet) => {
        const initialBalance = wallet.balance;
        const transactionDetails = {
          amount: 100,
        };

        const expectedBalance = initialBalance + transactionDetails.amount;

        // Perform the transaction
        chai
          .request(app)
          .post("/api/transactions/fund-account")
          .set("Authorization", `Bearer ${token}`)
          .send(transactionDetails)
          .end((err, res) => {
            if (err) return done(err);

            expect(res.status).to.be.equal(200);
            expect(res.body).to.be.a("object");
            expect(res.body.data.wallet.balance).to.be.equal(expectedBalance);
            expect(res.body.error).to.be.equal(undefined);

            done();
          });
      })
      .catch(done);
  });

  it("withdraw from account", function (done) {
    // Fetch the wallet balance before the transaction
    db("wallet")
      .where("user_id", currentUser.id)
      .first()
      .then((wallet) => {
        const initialBalance = wallet.balance;
        const transactionDetails = {
          amount: 100,
        };

        const expectedBalance = initialBalance - transactionDetails.amount;

        // Perform the transaction
        chai
          .request(app)
          .post("/api/transactions/withdraw-funds")
          .set("Authorization", `Bearer ${token}`)
          .send(transactionDetails)
          .end((err, res) => {
            if (err) return done(err);

            expect(res.status).to.be.equal(200);
            expect(res.body).to.be.a("object");
            expect(res.body.data.wallet.balance).to.be.equal(expectedBalance);
            expect(res.body.error).to.be.equal(undefined);

            done();
          });
      })
      .catch(done);
  });
  it("transfer to a user's account", async function () {
    // Transaction details
    const transactionDetails = {
      amount: 100,
    };

    // Fetch the sender's wallet balance before the transaction
    const user_wallet = await db("wallet")
      .where("user_id", currentUser.id)
      .first();
    const initialUsersBalance = user_wallet.balance;
    const expectedSendersBalance =
      initialUsersBalance - transactionDetails.amount;

    // Fetch the recipient's wallet balance before the transaction
    const receipient_wallet_id = 25;
    const receipient_wallet = await db("wallet")
      .where("id", receipient_wallet_id)
      .first();
    const initialReceipientsBalance = receipient_wallet.balance;
    const expectedReceipientBalance =
      initialReceipientsBalance + transactionDetails.amount;

    // Perform the transaction
    const res = await chai
      .request(app)
      .post(`/api/transactions/transfer-funds/${receipient_wallet_id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(transactionDetails);

    // Assertions
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.a("object");
    expect(res.body.data.userWallet.balance).to.be.equal(
      expectedSendersBalance
    );
    expect(res.body.data.receipientWallet.balance).to.be.equal(
      expectedReceipientBalance
    );
    expect(res.body.error).to.be.equal(undefined);
  });
});
