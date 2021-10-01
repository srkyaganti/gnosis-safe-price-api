const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/4e1a1225c8b64371b824946a2fac51a8'));


// const newBlockHeaders = web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
//     if (error) return console.error(error);

//     console.log('Successfully subscribed!', blockHeader);
// });

// const syncing = web3.eth.subscribe('syncing', (error, blockHeader) => {
//     if (error) return console.error(error);

//     console.log('syncing', blockHeader);
// });

const logs = web3.eth.subscribe('logs', (error, blockHeader) => {
    if (error) return console.error(error);

    console.log('logs', blockHeader);
});

// const pendingTransactions = web3.eth.subscribe('pendingTransactions', (error, blockHeader) => {
//     if (error) return console.error(error);

//     console.log('logs', blockHeader);
// });