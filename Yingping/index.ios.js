/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component, PropTypes} from "react";
import {AppRegistry} from 'react-native';
import App from './app/containers/App';
import { Provider } from 'react-redux';
import configureStore from './app/storage/configureStore'
const store = configureStore()
class Yingping extends Component {

  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Yingping', () => Yingping);
