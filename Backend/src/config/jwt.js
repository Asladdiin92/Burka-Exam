import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "./env.js";

export const JWT_SECRET = env.jwtSecret;
export const ACCESS_TOKEN_EXPIRY = "15m";
export const REFRESH_TOKEN_EXPIRY = "7d";

export function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function signRefreshToken(payload) {
  return jwt.sign(
    { ...payload, jti: crypto.randomUUID() },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

export function signToken(payload) {
  return signAccessToken(payload);
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
