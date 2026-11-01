const VALID_PROVIDERS = new Set(["telebirr", "cbe_birr", "chapa", "bank_transfer", "awash"]);

export function validatePaymentSubmission(body) {
  const errors = [];
  const { amount, currency, provider } = body || {};

  const numAmount = Number(amount);
  if (!Number.isFinite(numAmount) || numAmount <= 0) {
    errors.push("A positive payment amount is required.");
  }

  if (!currency || String(currency).trim().length === 0) {
    errors.push("Currency is required (e.g. ETB).");
  }

  if (provider && !VALID_PROVIDERS.has(String(provider).toLowerCase())) {
    errors.push("Invalid payment provider specified.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
