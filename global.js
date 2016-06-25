// Inject node globals into React Native global scope.
global.Buffer = require('buffer').Buffer;
global.process = require('process');

// Don't do this in production.
global.crypto = {
  getRandomValues(byteArray) {
    for (let i = 0; i < byteArray.length; i++) {
      byteArray[i] = Math.floor(256 * Math.random());
    }
  },
};
