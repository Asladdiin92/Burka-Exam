import mongoose from "mongoose";

export function validateObjectId(parameterName) {
  return (request, response, next) => {
    const value = request.params[parameterName];
    if (!mongoose.isValidObjectId(value)) {
      return response.status(400).json({ error: `${parameterName} must be a valid ID.` });
    }

    return next();
  };
}
