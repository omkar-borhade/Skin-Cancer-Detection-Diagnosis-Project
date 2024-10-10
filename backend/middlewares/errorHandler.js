// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err); // Log the error for debugging
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}, // Include stack trace only in development
  });
};

module.exports = errorHandler;
