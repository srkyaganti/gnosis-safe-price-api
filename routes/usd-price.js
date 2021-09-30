const express = require('express');
const router = express.Router();
const axios = require('axios').default;

const GNOSIS_SAFE_BASE_URL = 'https://safe-transaction.gnosis.io/api/v1/';

const fetchPrices = async (addresses) => {
  const validatedAddresses = addresses || [];

  const promises = validatedAddresses
  .map(e => e.trim())
  .map(address => {
    axios.get(`${GNOSIS_SAFE_BASE_URL}safes/${address}/balances/usd/`)
  });

  return await Promise.all(promises);
} 

/* Fetch usd prices for given addresses. */
router.post('/', async (req, res, next) => {
  res.json({ addresses: await fetchPrices(req.body.addresses) });
});

module.exports = router;
