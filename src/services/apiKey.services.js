const apiKeyModel = require('../models/apiKey.model');

class ApiKeyService {
  static findApiKeyById({ key }) {
    return apiKeyModel.findOne({ key }).lean();
  }
}

module.exports = ApiKeyService;
