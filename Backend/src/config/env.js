import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(currentDir, "../../.env"), override: true });
dotenv.config({ path: resolve(currentDir, "../../../.env"), override: true });

const required = (name, fallback) => {
  const value = process.env[name] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const env = {
  nodeEnv: required("NODE_ENV", "development"),
  port: Number(process.env.PORT || "3000"),
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/ethioprep",
  clientOrigin: required("CLIENT_ORIGIN", "http://localhost:3000"),
  clientOrigins: true,
  bcryptSaltRounds: Number(required("BCRYPT_SALT_ROUNDS", "12")),
  jwtSecret: required("JWT_SECRET", "ethioprep-dev-secret-key-min-32-chars"),
  emailUser: process.env.EMAIL_USER || "",
  emailPassword: process.env.EMAIL_PASSWORD || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  brevoApiKey: process.env.BREVO_API_KEY || "",
  requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION === "true"
};

if (
  !["mongodb+srv://", "mongodb://"].some((scheme) => env.mongodbUri.startsWith(scheme)) ||
  /[<>]|<cluster>|<username>|<password>/.test(env.mongodbUri) ||
  env.mongodbUri.includes("@cluster0.mongodb.net")
) {
  console.warn("Invalid or placeholder MONGODB_URI detected; falling back to local/in-memory mode.");
  env.mongodbUri = "mongodb://localhost:27017/ethioprep";
}

if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) {
  env.port = 3000;
}

if (!Number.isInteger(env.bcryptSaltRounds) || env.bcryptSaltRounds < 10) {
  env.bcryptSaltRounds = 12;
}
