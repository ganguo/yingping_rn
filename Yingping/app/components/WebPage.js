/**
 * Created by Ron on 5/7/2016.
 */
"use strict";
import ReactNative, {
  StyleSheet,
  Text,
  View,
  WebView,
} from 'react-native';
import {
  ThemeStyle,
  GlobalStyle,
  GGButton,
} from './../utils/CommonModules'
import React, { Component , PropTypes } from 'react';
import NavigationBar from 'react-native-navbar'

class WebPage extends Component {
  // 属性类型
  static propTypes = {
    openLink: PropTypes.string,
    navTitle: PropTypes.string,
    closeHandler: PropTypes.func,
  };
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      _link: props.openLink,
    };
  }

  // 渲染
  render() {

    const titleConfig = {
      title: this.props.navTitle,
      tintColor: 'white',
    };

    const backButtonConfig = {
      component: GGButton.buildBackButton(()=> {
        let handler = this.props.closeHandler
        if (typeof handler === 'function'){
          handler()
        }
      })
    };

    const { _theme } = this.props;
    const navigationBarTintColor = ThemeStyle[_theme].color.navigationBarTint
    const listBackgroundColor = ThemeStyle[_theme].color.listBackground
    return (
      <View style={[{flex:1},GlobalStyle.commonContainer,{backgroundColor:listBackgroundColor}]}>
        <NavigationBar key="webpagenavbar" style={{marginTop:0}} tintColor={navigationBarTintColor} title={titleConfig}
                       leftComponent={backButtonConfig}/>
        <WebView
          style={{flex:1,backgroundColor:listBackgroundColor}}
          source={{uri: this.state._link}}
          onNavigationStateChange={this.onNavigationStateChange}
          startInLoadingState={true}
        />
      </View>
    );
  }

}

export default WebPage;
