'use strict';

const babel = require('babel-core');

/**
 * This is your `.babelrc` equivalent.
 */
const babelRC = {
  presets: [require('babel-preset-react-native')],
  plugins: [
    // The following plugin will rewrite imports. Reimplementations of node
    // libraries such as `assert`, `buffer`, etc. will be picked up
    // automatically by the React Native packager.  All other built-in node
    // libraries get rewritten to their browserify counterpart.
    [require('babel-plugin-rewrite-require'), {
      aliases: {
        constants: 'constants-browserify',
        crypto: 'crypto-browserify',
        dns: 'node-libs-browser/mock/dns',
        domain: 'domain-browser',
        fs: 'node-libs-browser/mock/empty',
        http: 'stream-http',
        https: 'https-browserify',
        net: 'node-libs-browser/mock/net',
        os: 'os-browserify/browser',
        path: 'path-browserify',
        querystring: 'querystring-es3',
        stream: 'stream-browserify',
        _stream_duplex: 'readable-stream/duplex',
        _stream_passthrough: 'readable-stream/passthrough',
        _stream_readable: 'readable-stream/readable',
        _stream_transform: 'readable-stream/transform',
        _stream_writable: 'readable-stream/writable',
        sys: 'util',
        timers: 'timers-browserify',
        tls: 'node-libs-browser/mock/tls',
        tty: 'tty-browserify',
        vm: 'vm-browserify',
        zlib: 'browserify-zlib',

        // You can add your own, much like webpack aliases:
        'corporate-lib': 'corporate-lib-react-native',

        // You can also mock any libraries that you don't need to support on
        // React Native, but have to be present for 3rd party code to work:
        'some-third-party-dependency': 'node-libs-browser/mock/empty',
      },
      throwForNonStringLiteral: true,
    }],
  ],
};

function transform(src, filename, options) {
  const babelConfig = Object.assign({}, babelRC, {
    filename,
    sourceFileName: filename,
  });
  const result = babel.transform(src, babelConfig);
  return {
    ast: result.ast,
    code: result.code,
    map: result.map,
    filename: filename,
  };
}

module.exports = function(data, callback) {
  let result;
  try {
    result = transform(data.sourceCode, data.filename, data.options);
  } catch (e) {
    callback(e);
    return;
  }
  callback(null, result);
};
