const { redisClientHandler } = require('../config');

const { redisClient, DEFAULT_EXPIRATION } = redisClientHandler;

const redisHelper = {
    getCacheData,
    setCacheData
}

module.exports = redisHelper;

async function getCacheData(key) {
    const cacheData = await redisClient.get(JSON.stringify(key));
    return cacheData;

}

async function setCacheData(key, value) {
    await redisClient.setEx(JSON.stringify(key), DEFAULT_EXPIRATION, JSON.stringify(value));
}