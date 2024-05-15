'use strict';

const JWT = require('jsonwebtoken');

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

module.exports = {
  createTokenPair,
};
