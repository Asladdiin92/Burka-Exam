import { logger } from "../config/logger.js";

// Custom error classes for better error handling
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}

// Centralized error handler middleware
export function errorHandler(error, request, response, next) {
  const statusCode = error.statusCode || 500;
  const isOperational = error.isOperational || false;

  // Log server/non-operational errors as error, and operational 4xx responses as warn
  if (statusCode >= 500 || !isOperational) {
    logger.error("Error occurred", {
      message: error.message,
      statusCode,
      stack: error.stack,
      path: request.path,
      method: request.method,
      userId: request.user?._id,
      isOperational
    });
  } else {
    logger.warn(error.message, {
      statusCode,
      path: request.path,
      method: request.method,
      userId: request.user?._id,
      isOperational
    });
  }

  // Send appropriate error response
  const errorResponse = {
    error: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && !isOperational && { stack: error.stack })
  };

  response.status(statusCode).json(errorResponse);
}

// Async handler wrapper to catch errors in async route handlers
export function asyncHandler(fn) {
  return (request, response, next) => {
    Promise.resolve(fn(request, response, next)).catch(next);
  };
}

// Handle 404 routes
export function notFoundHandler(request, response) {
  response.status(404).json({
    error: `Route ${request.method} ${request.path} not found`
  });
}
