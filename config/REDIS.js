const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const DEFAULT_EXPIRATION = 3600;
const redisClient = redis.createClient(REDIS_PORT);

redisClient.connect().catch(console.error);

module.exports = { redisClient, DEFAULT_EXPIRATION };