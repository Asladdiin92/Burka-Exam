export function validateSubject(body) {
  const errors = [];
  const { name, code } = body || {};

  if (!name || String(name).trim().length < 2) {
    errors.push("Subject name is required and must have at least 2 characters.");
  }

  if (!code || String(code).trim().length < 2) {
    errors.push("Subject code is required (e.g. MATH_NAT, PHYS).");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateQuestion(body) {
  const errors = [];
  const { prompt, options, subjectId } = body || {};

  if (!prompt || String(prompt).trim().length < 5) {
    errors.push("Question prompt is required.");
  }

  if (!Array.isArray(options) || options.length < 2) {
    errors.push("Question must have at least 2 options.");
  } else {
    const hasCorrect = options.some((opt) => opt.isCorrect);
    if (!hasCorrect) {
      errors.push("At least one option must be marked as correct (isCorrect: true).");
    }
  }

  if (!subjectId) {
    errors.push("subjectId is required.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
