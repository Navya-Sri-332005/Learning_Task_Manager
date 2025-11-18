const AppError = require('../utils/AppError');

// Centralized error handler middleware
module.exports = (err, req, res, next) => {
  console.error(err);

  if (!(err instanceof AppError)) {
    // convert generic errors
    err = new AppError(err.message || 'Internal server error', err.statusCode || 500);
  }

  res.status(err.statusCode || 500).json({ success: false, message: err.message });
};
