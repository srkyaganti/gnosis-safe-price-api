const { delAsync, flushdb } = require('../index');

const invalidateKey = async(key) => {
    await delAsync(key);
}

const invalidateKeys = async(keys) => {
    await delAsync(keys);
}

const invalidateCache = () => {
    flushdb('SYNC');
}

module.exports = {
    invalidateKey,
    invalidateKeys,
    invalidateCache
}


