const axios = require('axios').default;

const GNOSIS_SAFE_BASE_URL = 'https://safe-transaction.gnosis.io/api/v1/';

const fetchUsdPrices = async (addresses) => {
  const validatedAddresses = addresses || [];

  const promises = validatedAddresses
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

module.exports = {
  fetchUsdPrices
}