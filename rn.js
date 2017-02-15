import React, { Component } from 'react';
import { Text, View } from 'react-native';

import './global';

import cryptoExample from './crypto_example';
import bitcoinExample from './bitcoin_example';
import httpExample from './http_example';

export default class ReactNativeExamples extends Component {

  state = {
    crypto: null,
    bitcoin: null,
    http: null,
  };

  componentDidMount() {
    process.nextTick(() => {
      cryptoExample().then((crypto) => this.setState({crypto}));
      bitcoinExample().then((bitcoin) => this.setState({bitcoin}));
      httpExample().then((http) => this.setState({http}));
    });
  }

  _renderResult(result) {
    if (result === null) {
      return 'waiting...';
    }
    if (result) {
      return 'success!';
    }
    return 'failed.';
  }

  render() {
    return (
      <View>
        <Text>Crypto: {this._renderResult(this.state.crypto)}</Text>
        <Text>Bitcoin: {this._renderResult(this.state.bitcoin)}</Text>
        <Text>HTTP: {this._renderResult(this.state.http)}</Text>
      </View>
    );
  }
}
