const keyTokenModel = require('../models/keytoken.model');

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey }) {
    try {
      const publicKeyString = publicKey.toString();
      const privateKeyString = privateKey.toString();
      const keys = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
        privateKey: privateKeyString,
      });

      return keys ? keys : null;
    } catch (error) {
      return error;
    }
  }
}

module.exports = KeyTokenService;
