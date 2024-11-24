const JWT = require('jsonwebtoken');
const { AuthFailureError } = require('../cores/error.response');

class TokenValidator {
  constructor(keyStore) {
    this.keyStore = keyStore;
  }

  verifyJWT(activeToken) {
    try {
      return JWT.verify(activeToken, this.keyStore.publicKey);
    } catch {
      throw new AuthFailureError('Invalid Token');
    }
  }

  verifyUserId({ decodedUser, requestUserId }) {
    if (requestUserId !== decodedUser.userId) {
      throw new AuthFailureError('User not authorized');
    }
  }
}

module.exports = TokenValidator;
