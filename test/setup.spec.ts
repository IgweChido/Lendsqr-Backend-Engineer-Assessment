import express from "express";
import loaders from "../src/loaders";

// Initialize and export the app
const app = express();

(async () => {
  await loaders({ expressApp: app });
})();

export default app;
