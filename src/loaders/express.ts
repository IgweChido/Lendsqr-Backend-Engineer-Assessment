var bodyParser = require("body-parser");
import express from "express";

const cors = require("cors");
import routes from "../api";

export default ({ app }: { app: express.Application }) => {
  app.enable("trust proxy");

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // transforms the raw string of req.body into json
  app.use(bodyParser.json());
  // app.use(express.json());

  // load API routes
  app.use("/api", routes());

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err["status"] = 404;
    next(err);
  });

  // / error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === "UnauthorizedError") {
      return res.status(err.status).send({ message: err.message }).end();
    }
    return next(err);
  });
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
