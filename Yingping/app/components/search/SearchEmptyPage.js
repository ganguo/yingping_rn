/**
 * Created by Ron on 26/5/2016.
 */
"use strict";
import ReactNative, {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image
} from 'react-native';

import React, { Component , PropTypes } from 'react';
import CommonModules,{
  ThemeStyle,
  dismissKeyboard,
} from '../../utils/CommonModules'

class SearchEmptyPage extends Component {
  // 默认属性
  static defaultProps = {};

  // 属性类型
  static propTypes = {};

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  // 自定义方法
  onTapPage() {
    dismissKeyboard()
  }

  // 渲染
  render() {
    const {_theme} = this.props
    const backgroundColor = ThemeStyle[_theme].color.listBackground
    return (
      <TouchableWithoutFeedback onPress={this.onTapPage}>
        <View style={[styles.emptypageContainer,{backgroundColor:backgroundColor}]}>
          <Image source={require('./../../resources/icon-search-gray.png')} style={styles.icon}/>
          <Text style={styles.text}>暂无相关搜索结果</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

}

const styles = StyleSheet.create({
  emptypageContainer: {
    flex: 1,
    backgroundColor: 'rgb(238,238,238)',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  icon:{
    marginTop: 200,
    width: 19,
    height: 19,
    marginRight: 19,
  },
  text:{
    marginTop: 200,
    fontSize: 19,
    color: 'rgb(143,143,143)'
  }
});

export default SearchEmptyPage;