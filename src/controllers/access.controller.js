'use strict';

const { CREATED } = require('../cores/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  async signUp(req, res, next) {
    const result = await AccessService.signUp(req.body);
    return new CREATED({
      message: 'Sign Up Success !',
      metadata: result,
      options: {
        limit: 1,
      },
    }).send(res);
  }
}

module.exports = new AccessController();
