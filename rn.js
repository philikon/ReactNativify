import React, { Component } from 'react';
import { Text, View } from 'react-native';

import './global';

import cryptoExample from './crypto_example';
import bitcoinExample from './bitcoin_example';

export default class ReactNativeExamples extends Component {

  state = {
    crypto: null,
    bitcoin: null,
  };

  componentDidMount() {
    process.nextTick(() => {
      cryptoExample((crypto) => this.setState({crypto}));
      bitcoinExample((bitcoin) => this.setState({bitcoin}));
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
      </View>
    );
  }
}
