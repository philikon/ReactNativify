'use strict';

const http = require('http');

module.exports = function example() {
  const inputData = 'How much wood would a woodchuck chuck, if a woodchuck could chuck wood?';
  const requestBody = Buffer.from(inputData, 'utf8');

  return new Promise((resolve, reject) => {
    http.request({
      method: 'POST',
      hostname: 'posttestserver.com',
      path: '/post.php',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': requestBody.length,
      },
    }, (res) => {
      let responseBody = null;
      res.on('data', (chunk) => {
        if (!responseBody) {
          responseBody = chunk;
        } else {
          responseBody = Buffer.concat([responseBody, chunk]);
        }
      });
      res.on('end', () => {
        const outputData = responseBody.toString('utf8');
        const expected = `Post body was ${requestBody.length} chars long`;
        resolve(outputData.indexOf(expected) !== -1);
      });
    }).end(requestBody);
  });
};

