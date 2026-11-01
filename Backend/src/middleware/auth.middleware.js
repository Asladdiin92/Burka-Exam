import { verifyToken } from "../config/jwt.js";
import { User } from "../models/User.js";

export const STAFF_ROLES = ["admin", "teacher", "content_manager", "cash_manager"];

export async function requireAuth(request, response, next) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.status(401).json({ error: "Authentication required." });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).lean();

    if (!user || user.status !== "active") {
      return response.status(401).json({ error: "Invalid or inactive user." });
    }

    request.user = user;
    return next();
  } catch (error) {
    return response.status(401).json({ error: "Invalid or expired token." });
  }
}

export async function optionalAuth(request, response, next) {
  try {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).lean();
      if (user && user.status === "active") {
        request.user = user;
      }
    }
  } catch {
    // Proceed as unauthenticated guest
  }
  return next();
}

export function requireRole(...allowedRoles) {
  return (request, response, next) => {
    if (!request.user) {
      return response.status(401).json({ error: "Authentication required." });
    }

    if (!allowedRoles.includes(request.user.role)) {
      return response.status(403).json({ error: "You do not have permission to access this resource." });
    }

    return next();
  };
}

export const requireStaffRole = requireRole(...STAFF_ROLES);
