'use strict';

const assert = require('assert');
const crypto = require('crypto');
const stream = require('stream');

module.exports = function example() {
  const alice = crypto.createDiffieHellman(256);
  const bob = crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());

  const alice_key = alice.generateKeys();
  const bob_key = bob.generateKeys();

  const alice_secret = alice.computeSecret(bob.getPublicKey());
  const bob_secret = bob.computeSecret(alice.getPublicKey());
  assert.equal(alice_secret.toString('hex'), bob_secret.toString('hex'));

  const cipher = crypto.createCipher('aes-256-ecb', alice_secret);
  const decipher = crypto.createDecipher('aes-256-ecb', bob_secret);

  const inputData = 'How much wood would a woodchuck chuck, if a woodchuck could chuck wood?';
  const input = new stream.Readable({
    read: function read() {
      this.push(new Buffer(inputData, 'utf-8'));
      this.push(null);
    }
  });

  let outputData = '';
  const output = new stream.Writable({
    write: function write(chunk, encoding, callback) {
      outputData += chunk.toString('utf-8');
      callback();
    }
  });

  input.pipe(cipher).pipe(decipher).pipe(output);

  return new Promise((resolve) => {
    output.on('finish', function () {
      resolve(outputData === inputData);
    });
  });
};
