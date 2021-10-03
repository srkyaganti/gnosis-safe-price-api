const express = require("express");
const logger = require("morgan");

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
  if (addresses.length === 0) {
    res.status(400).send("addresses should not be empty");
  }

  const validatedAddresses = addresses.map((address) => address.trim()).filter(e => e);

  if (validatedAddresses.length < 1 && validatedAddresses.length > 100) {
    res.status(404).send("addresses size should be b/w 1 & 100");
  }

  const cachedAddresses = await getCachedKeys(validatedAddresses);
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
          .then((response) => resolve({ address, success: true, data: JSON.parse(response) }))
          .catch((error) => {
            console.error(`Failed to get cached item for key ${address}`, error);
            resolve({ address, success: false, error });
          });
      })
  );

  const fetchedRedisData = await Promise.all(redisGetPromises);

  const successfulItems = fetchedRedisData.filter(({ success }) => success);
  const failedItems = fetchedRedisData.filter(({ success }) => !success);

  res.json({
    successfulItems,
    failedItems
  });
});

module.exports = app;
