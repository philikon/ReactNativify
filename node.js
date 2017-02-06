// Run this file with node to verify that crypto_example.js works in
// regular node, e.g. `node node.js`

const cryptoExample = require('./crypto_example');
const bitcoinExample = require('./bitcoin_example');

cryptoExample((result) => console.log('Crypto result: ' + result));
bitcoinExample((result) => console.log('Bitcoin result: ' + result));
