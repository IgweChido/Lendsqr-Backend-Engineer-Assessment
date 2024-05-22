import config from "./config";
const express = require("express");

async function startServer() {
  // declare express
  const app = express();

  // get the loaders that gets other things
  await require("./loaders").default({ expressApp: app });

  app
    .listen(config.port, () => {
      // logger

      console.log(`
    ################################################
    🛡️  Server listening on port: ${config.port} 🛡️
    ################################################
  `);
    })
    .on("error", (err) => {
      // logger
      console.log("error", err);
      process.exit(1);
    });
}

startServer();
