import chai from "chai";
import { expect } from "chai";
import chaiHttp from "chai-http";
const express = require("express");

import loaders from "../src/loaders";
import { db } from "../src/loaders/knex";
import app from "./setup.spec";

chai.use(chaiHttp);

describe("Auth controller", async () => {
  const accountDetails = {
    firstname: "John",
    lastname: "Doe",
    phone: "1234567890",
    email: "test@example.com",
    password: "password123",
  };

  it("Create an account", function (done) {
    this.timeout(5000);

    chai
      .request(app)
      .post("/api/auth/create-account")
      .send(accountDetails)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(undefined);

        done();
      });
  });
});
