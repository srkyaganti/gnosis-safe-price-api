const Web3 = require('web3');

const infuraWebSocketUrl = process.env.INFURA_WEBSOCKET_URL;
const wSweb3Client = new Web3(new Web3.providers.WebsocketProvider(infuraWebSocketUrl));

module.exports = {
    wSweb3Client
}