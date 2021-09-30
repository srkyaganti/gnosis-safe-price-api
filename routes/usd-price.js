const express = require('express');
const router = express.Router();

const axios = require('axios').default;

const { setAsync, getAsync, existsAsync } = require('../redis');

const _ = require('lodash');

const GNOSIS_SAFE_BASE_URL = 'https://safe-transaction.gnosis.io/api/v1/';

const getCachedAddresses = async (addresses) => {
  
  const promises = addresses.map(address => {
    return  new Promise((resolve, reject) => {
      existsAsync(address)
      .then(exists => resolve({address, exists}))
      .catch(error => reject({address, error}))
    })
  });

  const cacheStatuses = await Promise.all(promises);

  return cacheStatuses.filter(cacheStatus => cacheStatus.exists).map(({ address }) => address);
}

const fetchPrices = async (addresses) => {
  const validatedAddresses = addresses || [];

  const promises = validatedAddresses
    .map(e => e.trim())
    .map(address =>
      axios.get(`${GNOSIS_SAFE_BASE_URL}safes/${address}/balances/usd/`)
        .then(response => ({
          address,
          success: true,
          data: response.data
        }))
        .catch(error => ({
          address,
          success: false,
          error
        }))
    );

  return await Promise.all(promises);
}

/* Fetch usd prices for given addresses. */
router.post('/', async (req, res, next) => {
  const addresses = req.body.addresses || [];

  const validatedAddresses = addresses.map(address => address.trim()).filter(e => e);

  if (validatedAddresses.length < 1 && validatedAddresses.length > 100) {
    res.status(404).send('addresses size should be b/w 1 & 100');
  }

  //should rewrite this filter to remove the correct once, now everything is returning true;
  const cachedAddresses = await getCachedAddresses(validatedAddresses);
  console.log(`cachedAddresses - ${cachedAddresses}`);
  const addressesToBeFetched = _.difference(validatedAddresses, cachedAddresses);

  const prices = await fetchPrices(addressesToBeFetched);

  const redisSetPromises = prices.filter(price => price.success).map(({ address, data }) => setAsync(address, JSON.stringify(data)));

  await Promise.all(redisSetPromises);

  const redisGetPromises = validatedAddresses.map(async address => new Promise((resolve, reject) => {
    getAsync(address)
      .then(response => resolve({ address, data: JSON.parse(response) }))
      .catch(error => reject({ address, error }));
  }));

  const fetchedRedisData = await Promise.all(redisGetPromises);

  res.send(fetchedRedisData);
});

module.exports = router;
