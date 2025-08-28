// Response helper functions
exports.sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

exports.sendError = (res, statusCode, message, error = null) => {
  const response = {
    success: false,
    message
  };

  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

exports.sendSuccess = (res, message, data = null, statusCode = 200) => {
  return exports.sendResponse(res, statusCode, true, message, data);
};
