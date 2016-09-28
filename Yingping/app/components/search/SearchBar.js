/**
 * Created by Ron on 24/5/2016.
 */
"use strict";
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';

import React, { Component , PropTypes } from 'react';
import CommonModules,{
  ThemeStyle,
  screenWidth,
  GlobalTintColor,
  statusBarHeight,
  searchBarMarginTop,
} from '../../utils/CommonModules'

const SearchComponentShape = {
  component: PropTypes.object,
  style: PropTypes.any,
};

class SearchBar extends Component {
  // 默认属性
  static defaultProps = {};

  // 属性类型
  static propTypes = {
    textChangeHandler: PropTypes.func,
    leftItem: PropTypes.shape(SearchComponentShape),
    rightItem: PropTypes.shape(SearchComponentShape),
  };

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  componentWillUnMount(){
    console.log('0-0-----00-');
  }

  text() {
    return this._textfield.value
  }

  // 自定义方法
  didChangeText(text) {
    console.log(text)
    this.props.textChangeHandler(text)
  }

  getLeftComponent(width) {
    let item = this.props.leftItem;
    if (item) {
      let LeftComponent = item.component;
      if (LeftComponent) {
        return (
          <View style={styles.button}>
            {LeftComponent}
          </View>
        )
      }
    }
    return null
  }

  getRightComponent(width) {
    let item = this.props.rightItem;
    if (item) {
      let RightComponent = item.component;
      if (RightComponent) {
        return (
          <View style={[item.style,styles.button,(width>0)?{width:width}:{}]}>
            {RightComponent}
          </View>
        )
      }
    }
    return null
  }

  // 渲染
  render() {

    const {_theme} = this.props
    const barTintColor = ThemeStyle[_theme].color.navigationBarTint
    const placeholderColor = ThemeStyle[_theme].color.searchBarPlaceHolder
    let buttonWidth = 40
    let inputWidth = screenWidth - (buttonWidth*2)
    return (
      <View style={[styles.container,{backgroundColor:barTintColor}]}>
        {this.getLeftComponent(buttonWidth)}
        <View style={[styles.textfieldContainer,{width:inputWidth}]}>
          <TextInput ref={(ref)=>{this._textfield = ref}} style={[styles.textfield,{width:inputWidth}]}
                     autoCorrect={false}
                     autoFocus={true}
                     placeholder='输入关键词'
                     placeholderTextColor={placeholderColor}
                     returnKeyType='search'
                     underlineColorAndroid='white'
                     onChangeText={(newText)=>{
                      this.didChangeText(newText)
                  }}
          />
        <View style={[styles.line,{width:inputWidth}]}/>
          </View>
        {/*
        <View style={[styles.textfieldContainer,{width:inputWidth}]}>
          <TextInput ref={(ref)=>{this._textfield = ref}} style={[styles.textfield,{width:inputWidth}]}
                     autoCorrect={false}
                     placeholder='输入关键词'
                     placeholderTextColor={placeholderColor}
                     returnKeyType='search'
                     onChangeText={(newText)=>{
                      this.didChangeText(newText)
                  }}
          />
          <View style={[styles.line,{width:inputWidth}]}/>
        </View>
        */}
        {this.getRightComponent(buttonWidth)}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44 + 20,
    backgroundColor: GlobalTintColor,
  },
  textfieldContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    height: 44,
    marginTop: 20 + 10,
    marginHorizontal: 0,
  },
  textfield: {
    color: 'white',
    height: 39,
    marginLeft: 5,
  },
  button:{
    marginTop: searchBarMarginTop,
    width: 40,
    height: 44,
  }
});

export default SearchBar;
