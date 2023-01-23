const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const DEFAULT_EXPIRATION = 3600;

const redisClient = redis.createClient(REDIS_PORT);

redisClient.connect().catch(console.error);
redisClient.on('connect', () => {
    console.log('Redis Server Connected!');
  });


const redisClientHandler = { redisClient, DEFAULT_EXPIRATION };

module.exports = redisClientHandler;