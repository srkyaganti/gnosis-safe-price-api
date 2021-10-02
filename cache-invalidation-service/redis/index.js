const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

const { promisify } = require("bluebird");
Promise.promisify

module.exports = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  existsAsync: promisify(client.exists).bind(client),
  delAsync: promisify(client.del).bind(client),
};