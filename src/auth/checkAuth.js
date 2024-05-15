// middleware

const ApiKeyService = require('../services/apiKey.services');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

const checkAuth = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY];
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    // check api key exists
    const objKey = await ApiKeyService.findApiKeyById({ key });
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    req.objKey = objKey;

    return next();
  } catch (error) {}
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions.length) {
      return res.status(403).json({ message: 'Permission Denied' });
    }

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({ message: 'Permission Denied' });
    }

    return next();
  };
};

module.exports = {
  checkAuth,
  checkPermission,
};
