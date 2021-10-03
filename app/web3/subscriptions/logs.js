const { wSweb3Client } = require('../index');

const logsSubscriptions = {};

const defaultCallback = (error, data) => {
    if (error) {
        console.error(error);
        return;
    };

    console.log('logs event:', data);
};

const subscribeLogsToAddress = (address, callback = defaultCallback) => {
    if (!address) {
        // Don't subscribe to events in case the address is not valid
        return;
    }

    if (logsSubscriptions[address]) {
        return logsSubscriptions[address];
    }

    const subscription  = wSweb3Client.eth.subscribe('logs', { address }, callback);

    logsSubscriptions[address] = subscription;
}

module.exports = subscribeLogsToAddress;