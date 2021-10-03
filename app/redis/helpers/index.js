const { invalidateKey, invalidateKeys, invalidateCache } = require('./invalidate');
const { getCachedKeys } = require('./cache_repository');

module.exports = {
    invalidateKey, 
    invalidateKeys,
    invalidateCache,
    getCachedKeys
}