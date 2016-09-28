/**
 * Created by Ron on 27/5/2016.
 */
"use strict";
import ReactNative, {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicatorIOS,
  StatusBar,
} from 'react-native';

import CommonModules,{
  ThemeStyle,
} from './../../utils/CommonModules'
import React, { Component , PropTypes } from 'react';
import GiftedSpinner from '../../vendors/react-native-gifted-spinner';

class LoadingWidget extends Component {
  // 默认属性
  static defaultProps = {
    text: '加载中',
  };

  // 属性类型
  static propTypes = {
    text: PropTypes.string,
  };

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  // 渲染
  render() {

    StatusBar.setBarStyle('light-content',false)

    const {_theme} = this.props

    let textColor = (_theme) ? ThemeStyle[_theme].color.defaultText : undefined

    let textView ;
    if(this.props.text!=''){
      textView = <Text style={[styles.textStyle,(textColor)?{color:textColor}:{}]}>{this.props.text}</Text>;
    }

    return (
      <View style={styles.container}>
        <GiftedSpinner />
        {textView}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    margin: 10,
    color: 'rgb(20,20,20)',
    fontSize: 15,
  }
});

export default LoadingWidget;
