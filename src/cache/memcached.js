const Memcached = require("memcached");
const memcached = new Memcached("cloubirding-10820566-cache.km2jzi.cfg.apse2.cache.amazonaws.com:11211");

// Promisify for async/await
memcached.aGet = (key) =>
  new Promise((resolve, reject) => {
    memcached.get(key, (err, data) => (err ? reject(err) : resolve(data)));
  });

memcached.aSet = (key, value, ttl) =>
  new Promise((resolve, reject) => {
    memcached.set(key, value, ttl, (err) => (err ? reject(err) : resolve(true)));
  });

module.exports = memcached;

