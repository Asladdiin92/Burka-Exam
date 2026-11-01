import test from "node:test";
import assert from "node:assert/strict";
import { signAccessToken, signRefreshToken, verifyToken } from "./jwt.js";

test("signRefreshToken generates distinct tokens even within the same millisecond", () => {
  const tokenA = signRefreshToken({ userId: "507f1f77bcf86cd799439011" });
  const tokenB = signRefreshToken({ userId: "507f1f77bcf86cd799439011" });
  assert.notEqual(tokenA, tokenB);

  const decodedA = verifyToken(tokenA);
  const decodedB = verifyToken(tokenB);
  assert.equal(decodedA.userId, "507f1f77bcf86cd799439011");
  assert.equal(decodedB.userId, "507f1f77bcf86cd799439011");
  assert.notEqual(decodedA.jti, decodedB.jti);
});

test("signAccessToken and verifyToken roundtrip payload", () => {
  const accessToken = signAccessToken({ userId: "507f1f77bcf86cd799439011", role: "student" });
  const decoded = verifyToken(accessToken);
  assert.equal(decoded.userId, "507f1f77bcf86cd799439011");
  assert.equal(decoded.role, "student");
});
