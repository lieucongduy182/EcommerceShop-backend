const redis = require('redis');
const { promisify } = require('util');
const {
  reservationInventory,
} = require('../repositories/inventory/inventory.repo');
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

const pExpire = promisify(redisClient.pExpire).bind(redisClient);
const setNXAsync = promisify(redisClient.setNX).bind(redisClient);
const delAsyncKey = promisify(redisClient.del).bind(redisClient);

const acquireLock = async (productId, quantity, userId) => {
  const key = `lock:${productId}:${userId}`;
  const retriesTime = 10;
  const expireTime = 3000; // 3 seconds

  for (let i = 0; i < retriesTime; i++) {
    const result = await setNXAsync(key, expireTime);
    console.log('Result of setNXAsync:::', result);
    if (result === 1) {
      // manipulate inventory
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });

      if (isReservation.modifiedCount) {
        await pExpire(key, expireTime);
        return key;
      }
      return null;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

const releaseLock = async (key) => {
  return delAsyncKey(key);
};

module.exports = {
  acquireLock,
  releaseLock,
};
