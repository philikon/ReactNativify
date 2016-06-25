/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import './global';
import cryptoExample from './crypto_example';

class ReactNativify extends Component {

  state = {
    result: null,
  };

  componentDidMount() {
    process.nextTick(() => {
      cryptoExample((result) => this.setState({result}));
    });
  }

  render() {
    let result;
    if (this.state.result === null) {
      result = 'waiting...';
    } else if (this.state.result) {
      result = 'success!';
    } else {
      result = 'failed.';
    }
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text>Result: {result}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ReactNativify', () => ReactNativify);
