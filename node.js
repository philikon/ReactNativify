// Run this file with node to verify that crypto_example.js works in
// regular node, e.g. `node node.js`

const cryptoExample = require('./crypto_example');
const bitcoinExample = require('./bitcoin_example');
const httpExample = require('./http_example');

process.on('exit', () => undefined);

Promise.all([
  cryptoExample(),
  bitcoinExample(),
  httpExample(),
]).then(([crypto, bitcoin, http]) => {
  console.log('Crypto result: ' + crypto);
  console.log('Bitcoin result: ' + bitcoin);
  console.log('HTTP result: ' + http);
});
