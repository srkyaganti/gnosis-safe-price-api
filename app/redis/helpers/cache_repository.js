const { existsAsync } = require("../index");

const getCachedKeys = async (keys) => {
  const promises = keys.map((key) => {
    return new Promise((resolve, reject) => {
      existsAsync(key)
        .then((exists) => resolve({ key, exists }))
        .catch((error) => {
          console.error(
            `Failed to fetch key status from redis for key: ${key}`,
            error
          );
          //not rejecting to show atleast partial data
          resolve({ key, exists: false });
        });
    });
  });

  const cacheStatuses = await Promise.all(promises);

  return cacheStatuses
    .filter(({ exists }) => exists)
    .map(({ key }) => key);
};

module.exports = {
  getCachedKeys
};
