// require('dotenv').config();
const express = require("express");
const logger = require("morgan");

const invalidationModes = require("./constants/invalidation_modes");
//TODO: integrate this on building log based cache invalidation strategy for each address
const invalidationMode = process.env.INVALIDATION_MODE || invalidationModes.BLOCK_HEADERS;

const { getCachedKeys } = require('./redis/helpers');
const { getAsync, setAsync } = require('./redis');
const { fetchUsdPrices } = require('./gnosis-safe');

const _ = require('lodash');

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
  res.json({ title: "Express App" });
});

app.post("/price", async (req, res, next) => {
  const addresses = req.body.addresses || [];
  if (addresses == []) {
    res.status(400).send("addresses should not be empty");
  }

  const validatedAddresses = addresses.map((address) => address.trim()).filter(e => e);

  if (validatedAddresses.length < 1 && validatedAddresses.length > 100) {
    res.status(404).send("addresses size should be b/w 1 & 100");
  }

  const cachedAddresses = await getCachedKeys(validatedAddresses);
  console.log(`cachedAddresses - ${cachedAddresses}`);
  
  const cacheMissedAddresses = _.difference(validatedAddresses, cachedAddresses);

  const prices = await fetchUsdPrices(cacheMissedAddresses);

  const redisSetPromises = prices
    .filter((price) => price.success)
    .map(({ address, data }) => setAsync(address, JSON.stringify(data)));

  await Promise.all(redisSetPromises);

  const redisGetPromises = validatedAddresses.map(
    async (address) =>
      new Promise((resolve, reject) => {
        getAsync(address)
          .then((response) => resolve({ address, data: JSON.parse(response) }))
          .catch((error) => reject({ address, error }));
      })
  );

  const fetchedRedisData = await Promise.all(redisGetPromises);

  res.send(fetchedRedisData);
});

module.exports = app;
