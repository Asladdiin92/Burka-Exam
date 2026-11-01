import dns from "node:dns";
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // ignore
}
import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { verifyEmailTransport } from "./config/email.js";

let server;
let previewServer;

async function start() {
  const primaryPort = 3000;
  server = app.listen(primaryPort, "0.0.0.0", () => {
    console.info(`EthioPrep API & Web listening on http://0.0.0.0:${primaryPort}`);
  });
  server.on("error", (err) => {
    console.error(`Port ${primaryPort} error:`, err.message);
  });

  if (env.port && env.port !== primaryPort) {
    previewServer = app.listen(env.port, "0.0.0.0", () => {
      console.info(`EthioPrep API & Web mirror listening on http://0.0.0.0:${env.port}`);
    });
    previewServer.on("error", () => {});
  }

  await connectDatabase();

  if (env.emailUser && env.emailPassword) {
    verifyEmailTransport().catch(() => {});
  }
}

async function shutdown(signal) {
  console.info(`${signal} received. Shutting down.`);
  if (previewServer) {
    previewServer.close(() => {});
  }
  if (server) {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  } else {
    await disconnectDatabase();
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start();
