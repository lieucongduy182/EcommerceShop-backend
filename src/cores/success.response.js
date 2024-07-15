'use strict';

const StatusCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
};

const ReasonStatusCode = {
  OK: 'Success',
  CREATED: 'Created',
  ACCEPTED: 'Accepted',
  NO_CONTENT: 'No Content',
};

class SuccessResponse {
  constructor({
    message,
    status = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = status;
    this.metadata = metadata;
  }

  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    status = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata,
    options = {},
  }) {
    super({
      message,
      status,
      reasonStatusCode,
      metadata,
    });
    this.options = options;
  }
}

module.exports = {
  OK,
  CREATED,
};
