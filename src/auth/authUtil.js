'use strict';

const JWT = require('jsonwebtoken');
const crypto = require('crypto');
const {
  AuthFailureError,
  NotFoundError,
  InternalServerError,
} = require('../cores/error.response');
const KeyTokenService = require('../services/keyToken.service');
const { asyncHandler } = require('../helpers/asyncHandler');
const TokenValidator = require('../validator/token');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'x-rtoken-id',
};

const createTokenPair = async ({ payload, publicKey, privateKey }) => {
  try {
    // generate accessToken
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2d',
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7d',
    });

    // Verify Token
    JWT.verify(accessToken, publicKey, (error, decoded) => {
      if (error) {
        throw Error(error);
      }
      console.log('decoded:::', decoded);
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log('error:::', error);
  }
};

const generateKeyPairSync = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });
  return { publicKey, privateKey };
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError('Invalid Request');
  }

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError('Not found keyStore');
  }

  try {
    const accessToken = req.headers[HEADER.AUTHORIZATION]?.split(' ')[1];
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
    if (!refreshToken && !accessToken) {
      throw new AuthFailureError('Invalid Request');
    }

    const validator = new TokenValidator(keyStore);
    const activeToken = refreshToken || accessToken;
    const decodedUser = validator.verifyJWT(activeToken);
    validator.verifyUserId({ decodedUser, requestUserId: userId });

    Object.assign(req, {
      keyStore,
      user: decodedUser,
      refreshToken: activeToken,
    });

    next();
  } catch (error) {
    throw new InternalServerError();
  }
});

module.exports = {
  createTokenPair,
  generateKeyPairSync,
  authentication,
};
