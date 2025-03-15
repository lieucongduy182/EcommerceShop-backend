const { ApiKeyModel } = require('../models');

class ApiKeyService {
  static findApiKeyById({ key }) {
    return ApiKeyModel.findOne({ key }).lean();
  }
}

module.exports = ApiKeyService;
