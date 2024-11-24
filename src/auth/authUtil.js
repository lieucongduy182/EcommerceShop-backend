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

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
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
  const accessToken = req.headers[HEADER.AUTHORIZATION]?.split(' ')[1];
  if (!userId || !accessToken) {
    throw new AuthFailureError('Invalid Request');
  }

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError('Not found keyStore');
  }

  try {
    const decoded = JWT.verify(accessToken, keyStore.publicKey);
    console.log('decoded:::', decoded);
    if (userId !== decoded.userId) {
      throw new AuthFailureError('Invalid Request');
    }

    req.keyStore = keyStore;
    next();
  } catch (error) {
    throw new InternalServerError();
  }
});

const verifyJWT = ({ token, key }) => {
  return JWT.verify(token, key);
};

module.exports = {
  createTokenPair,
  generateKeyPairSync,
  authentication,
  verifyJWT,
};
