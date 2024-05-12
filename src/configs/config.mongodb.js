const configs = {
  development: {
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 27017,
      name: process.env.DB_NAME || 'shopDev',
      user: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
    },
  },
  production: {
    database: {
      host: process.env.PRO_DB_HOST || 'localhost',
      port: process.env.PRO_DB_PORT || 27017,
      name: process.env.PRO_DB_NAME || 'shopPro',
      user: process.env.PRO_DB_USER || '',
      password: process.env.PRO_DB_PASSWORD || '',
    },
  },
};

const ENV = process.env.NODE_ENV || 'development';

module.exports = configs[ENV];
