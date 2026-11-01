const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(body) {
  const errors = [];
  const { email, password, displayName } = body || {};

  if (!email || !EMAIL_REGEX.test(String(email).trim())) {
    errors.push("A valid email address is required.");
  }

  if (!password || String(password).length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (!displayName || String(displayName).trim().length < 2) {
    errors.push("Display name must be at least 2 characters long.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateLogin(body) {
  const errors = [];
  const { email, password } = body || {};

  if (!email || !EMAIL_REGEX.test(String(email).trim())) {
    errors.push("A valid email address is required.");
  }

  if (!password) {
    errors.push("Password is required.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
