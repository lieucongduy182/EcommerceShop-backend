const StatusCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const ResponseStatusCode = {
  FORBIDDEN: 'Forbidden Error',
  BAD_REQUEST: 'BadRequest Error',
  CONFLICT: 'Conflict Error',
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.BAD_REQUEST,
    statusCode = StatusCode.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
};
