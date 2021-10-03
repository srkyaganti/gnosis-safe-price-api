const { invalidateCache } = require('./redis/helpers');

const { subscribeToBlockHeaders } = require('./web3/subscriptions');

const subscription = subscribeToBlockHeaders(invalidateCache);
console.log('started cache-invalidation-service');