import dns from "node:dns";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // ignore
}

import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { verifyEmailTransport } from "./config/email.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const webIndexHtml = resolve(currentDir, "../../Web/dist/index.html");

let server;
let shuttingDown = false;

function ensureWebDistBuilt() {
  if (fs.existsSync(webIndexHtml)) return;
  const rootDir = resolve(currentDir, "../..");
  const child = spawn("npm", ["run", "build"], {
    cwd: rootDir,
    stdio: "ignore",
    detached: false
  });
  child.on("error", () => {});
  child.unref();
}

function listenWithRetry(port, host = "0.0.0.0", retries = 12, delayMs = 250) {
  return new Promise((resolvePromise) => {
    const attempt = (remaining) => {
      const srv = app.listen(port, host, () => {
        console.info(`Burka Exam API & Web listening on http://${host}:${port}`);
        resolvePromise(srv);
      });
      srv.on("error", (err) => {
        if (err.code === "EADDRINUSE" && remaining > 0 && !shuttingDown) {
          setTimeout(() => attempt(remaining - 1), delayMs).unref();
          return;
        }
        console.error(`Port ${port} error:`, err.message);
        resolvePromise(srv);
      });
    };
    attempt(retries);
  });
}

async function start() {
  ensureWebDistBuilt();
  await connectDatabase();

  try {
    const { User } = await import("./models/User.js");
    await User.updateMany(
      {
        $or: [
          { "profile.telegramLink": { $exists: false } },
          { "profile.telegramLink": null },
          { "profile.telegramLink": "" },
          { "profile.telegramLink": "Not set" }
        ]
      },
      {
        $set: {
          "profile.telegramLink": "https://t.me/Ethio_student_preparetion"
        }
      }
    );
  } catch (err) {
    console.warn("Telegram link migration notice:", err.message);
  }

  const primaryPort = env.port;
  server = await listenWithRetry(primaryPort, "0.0.0.0");

  if (env.emailUser && env.emailPassword) {
    verifyEmailTransport().catch(() => {});
  }
}

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.info(`${signal} received. Shutting down.`);
  if (server) {
    server.closeAllConnections?.();
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    setTimeout(() => process.exit(0), 1500).unref();
  } else {
    await disconnectDatabase();
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err?.message || err);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason?.message || reason);
});

start();
