'use strict';

const { CREATED, SuccessResponse } = require('../cores/success.response');
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

  async login(req, res, next) {
    return new SuccessResponse({
      message: 'Login Success!',
      metadata: await AccessService.login(req.body),
    }).send(res);
  }

  async logout(req, res, next) {
    return new SuccessResponse({
      message: 'Logout Success!',
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  }

  async handleRefreshToken(req, res, next) {
    return new SuccessResponse({
      message: 'Refresh Token Success!',
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.body.refreshToken,
      }),
    }).send(res);
  }
}

module.exports = new AccessController();
