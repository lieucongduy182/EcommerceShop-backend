'use strict';
const shopModel = require('../models/shops.model');
const bcrypt = require('bcrypt');
const KeyTokenService = require('./keyToken.service');
const ShopService = require('./shop.service');
const {
  createTokenPair,
  generateKeyPairSync,
  verifyJWT,
} = require('../auth/authUtil');
const utils = require('../utils');
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require('../cores/error.response');

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
      const { publicKey, privateKey } = generateKeyPairSync();

      // create Token pair
      const payload = {
        userId: newShop._id,
        name: newShop.name,
        email: newShop.email,
      };
      const tokens = await createTokenPair({
        payload,
        publicKey: publicKey.toString(),
        privateKey,
      });

      if (tokens) {
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
          refreshToken: tokens.refreshToken,
        });

        if (!keyStore) {
          throw new BadRequestError('Error: Create public key');
        }
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

  static async login({ email, password, refreshToken = null }) {
    const foundShop = await ShopService.findByEmail({ email });
    if (!foundShop) throw new BadRequestError('Shop not registered!');

    const isMatchPassword = await bcrypt.compare(password, foundShop.password);
    if (!isMatchPassword) throw new AuthFailureError('Wrong password!');

    const userId = foundShop._id;
    const payload = {
      userId,
      email,
    };
    const { publicKey, privateKey } = generateKeyPairSync();
    const tokens = await createTokenPair({
      payload,
      publicKey,
      privateKey,
    });
    // save RT, Public Key, Private Key
    if (tokens?.refreshToken) {
      await KeyTokenService.createKeyToken({
        userId,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });
    }

    return {
      shop: utils.getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop,
      }),
      tokens,
    };
  }

  static async logout({ keyStore }) {
    return KeyTokenService.removeKeyById(keyStore._id);
  }

  static async handleRefreshToken({ refreshToken }) {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    // if exist, detect who user?
    if (foundToken) {
      const { userId, email } = verifyJWT({
        token: refreshToken,
        key: foundToken.privateKey,
      });
      await KeyTokenService.removeByUserId(userId);
      throw new ForbiddenError(
        'Something went wrong! Please try again to login in!'
      );
    }

    // allow to verify token
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthFailureError('Shop not registered');
    }

    const { userId, email } = verifyJWT({
      token: refreshToken,
      key: holderToken.privateKey,
    });
    console.table([
      {
        email,
        userId,
      },
    ]);

    const foundShop = await ShopService.findByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError('Shop not registered');
    }

    // create token pair
    const tokens = await createTokenPair({
      payload: { userId, email },
      publicKey: holderToken.publicKey,
      privateKey: holderToken.privateKey,
    });

    // update new tokens
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken, // used to retrieve new token
      },
    });

    return {
      tokens,
      shop: utils.getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop,
      }),
    };
  }
}

module.exports = AccessService;
