const { wSweb3Client } = require('../index');

let newBlockHeadersSubscription;

const defaultCallback = (error, blockHeader) => {
    if (error) {
        console.error(error);
        return;
    };

    console.log('newBlockHeaders event:', blockHeader);
};

const subscribeToBlockHeaders = (callback = defaultCallback) => {
    if(newBlockHeadersSubscription) {
        return newBlockHeadersSubscription;
    }
    
    newBlockHeadersSubscription = wSweb3Client.eth.subscribe('newBlockHeaders', callback);
}

module.exports = subscribeToBlockHeaders;