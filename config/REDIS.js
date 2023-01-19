const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const DEFAULT_EXPIRATION = 3600;
const redisClient = redis.createClient(REDIS_PORT);

module.exports = { redisClient, DEFAULT_EXPIRATION };