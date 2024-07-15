'use strict';
const shopModel = require('../models/shops.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtil');
const utils = require('../utils');
const { BadRequestError } = require('../cores/error.response');

const ROLE_SHOPS = {
  ADMIN: '001',
  SHOP: '002',
  WRITER: '003',
  EDITOR: '004',
};

class AccessService {
  static async signUp({ name, email, password }) {
    // check email if exist
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Error: Shop already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [ROLE_SHOPS.SHOP],
    });

    if (newShop) {
      // create private key and public key
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

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError('Error: Create public key');
      }

      // create Token pair
      const payload = {
        userId: newShop._id,
        name: newShop.name,
        email: newShop.email,
      };
      const { publicKey: publicKeyString } = keyStore;
      const tokens = await createTokenPair({
        payload,
        publicKey: publicKeyString,
        privateKey,
      });

      if (tokens) {
        return {
          status: 201,
          metadata: {
            shop: utils.getInfoData({
              fields: ['_id', 'name', 'email'],
              object: newShop,
            }),
            tokens,
          },
        };
      }
    }

    return {
      code: 400,
      metadata: null,
    };
  }
}

module.exports = AccessService;
