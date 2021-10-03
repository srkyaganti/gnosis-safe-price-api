const { delAsync, client } = require('../index');

const invalidateKey = async(key) => {
    await delAsync(key);
}

const invalidateKeys = async(keys) => {
    await delAsync(keys);
}

const invalidateCache = () => {
    client.flushdb((error, data) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log('flushed redis db', data);
    });
}

module.exports = {
    invalidateKey,
    invalidateKeys,
    invalidateCache
}


