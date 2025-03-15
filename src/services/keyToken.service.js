const { KeyTokenModel } = require('../models');
const { BadRequestError } = require('../cores/error.response');
const { Types } = require('mongoose');

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
    try {
      const filter = { user: userId };
      const updateData = {
        publicKey: publicKey.toString(),
        privateKey: privateKey.toString(),
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await KeyTokenModel.findOneAndUpdate(
        filter,
        updateData,
        options,
      );

      if (!tokens) {
        throw new BadRequestError('Failed to create or update key token');
      }

      return tokens.publicKey;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }

  static findByUserId(userId) {
    return KeyTokenModel.findOne({ user: new Types.ObjectId(userId) });
  }

  static removeKeyById(id) {
    return KeyTokenModel.deleteOne({ _id: new Types.ObjectId(id) });
  }

  static removeByUserId(userId) {
    return KeyTokenModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
    });
  }

  static findByRefreshTokenUsed(refreshToken) {
    return KeyTokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
  }

  static findByRefreshToken(refreshToken) {
    return KeyTokenModel.findOne({ refreshToken });
  }
}

module.exports = KeyTokenService;
