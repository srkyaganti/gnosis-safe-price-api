## Gnosis safe USD price fetcher
This multi-service [Node.js](https://nodejs.org/en/) microservice setup is used to optimise the [Gnosis safe](https://gnosis-safe.io) USD price fetching [API](https://safe-transaction.gnosis.io/) for a given safe address

---

### Setup
#### Prerequisites
* [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/)
* [Infura](infura.io) API key. You can create a free accoutn and create a new project to get the key. instructions [here](https://ethereumico.io/knowledge-base/infura-api-key-guide/)

### How to run
* in your terminal run the command to start the service `INFURA_KEY=<your_infura_key> docker-compose up`

You should see the service start on local on port 3000(by default)

### Testing
* via [Postman](https://www.postman.com/)
  * import the [collection](https://www.getpostman.com/collections/986c01618f3a6c09158a) 
  * Use the `usd-price-fetch` API by passing the required addresses

* via [cURL](https://curl.se/)
```
curl --location --request POST 'localhost:3000/price' \
--header 'Content-Type: application/json' \
--data-raw '{
  "addresses": [
    "0x5e14ed9dCeE22ba758E8de482301028b261c4a14",
    "0xF1D8c2eED95D5fC2EaDe4E6Bb15a5969453E89a9",
    "0x89C51828427F70D77875C6747759fB17Ba10Ceb0",
    "0xf26d1Bb347a59F6C283C53156519cC1B1ABacA51"
  ]
}
'
```
---
### Project organisation
```
.
├── ANSWERS.md
├── README.md
├── app
│   ├── Dockerfile
│   ├── app.js
│   ├── bin
│   │   └── www
│   ├── gnosis-safe
│   │   ├── api
│   │   │   └── usd_price_fecher.js
│   │   └── index.js
│   ├── package-lock.json
│   ├── package.json
│   ├── redis
│   │   ├── helpers
│   │   │   ├── cache_repository.js
│   │   │   ├── index.js
│   │   │   └── invalidate.js
│   │   └── index.js
│   └── web3
│       ├── index.js
│       └── subscriptions
│           ├── block_headers.js
│           ├── index.js
│           └── logs.js
├── cache-invalidation-service
│   ├── Dockerfile
│   ├── app.js
│   ├── package-lock.json
│   ├── package.json
│   ├── redis
│   │   ├── helpers
│   │   │   ├── index.js
│   │   │   └── invalidate.js
│   │   └── index.js
│   └── web3
│       ├── index.js
│       └── subscriptions
│           ├── block_headers.js
│           ├── index.js
│           └── logs.js
└── docker-compose.yml
```
---
### Components

#### app
* This is an express app generated using [express-generator](https://expressjs.com/en/starter/generator.html) which exposes on API POST: /price to fetch the usd price of tokens for given safe addresses
* it uses redis to cache the data since the data would not keep changing all the times since the transactions on blockchain are written in batches which can be captured using the new block creation event, though there is a default expiry set in case the block creation event is missed

#### cache-invalidation-service
* This is a websocket service that listens to [newBlockHeaders](https://web3js.readthedocs.io/en/v1.2.11/web3-eth-subscribe.html#subscribe-newblockheaders) event via [web3](https://www.npmjs.com/package/web3) and invalidates the redis cache using a sync [flusbdb](https://redis.io/commands/flushdb) call

#### redis
* This is used to persist the data locally to reduce the overall latency of the app
* The current setup runs on a single threaded mode
