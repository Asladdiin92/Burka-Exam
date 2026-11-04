export function isUserPremium(user, payments = []) {
  if (!user) return false;
  const role = String(user.role || "").toLowerCase();
  if (["admin", "teacher", "content_manager", "cash_manager"].includes(role)) {
    return true;
  }
  if (Boolean(user.isPremium)) {
    return true;
  }
  if (Array.isArray(payments) && payments.some((p) => p && p.status === "verified")) {
    return true;
  }
  return false;
}
