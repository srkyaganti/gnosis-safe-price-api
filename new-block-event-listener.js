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

const logs = web3.eth.subscribe('logs', {
    // address: [
    //     "0xF1D8c2eED95D5fC2EaDe4E6Bb15a5969453E89a9",
    //     "0x5e14ed9dCeE22ba758E8de482301028b261c4a14",
    //     "0x89C51828427F70D77875C6747759fB17Ba10Ceb0",
    //     "0xf26d1Bb347a59F6C283C53156519cC1B1ABacA51"
    // ]
}, (error, blockHeader) => {
    if (error) return console.error(error);

    console.log('logs', blockHeader);
});

// const pendingTransactions = web3.eth.subscribe('pendingTransactions', (error, blockHeader) => {
//     if (error) return console.error(error);

//     console.log('logs', blockHeader);
// });