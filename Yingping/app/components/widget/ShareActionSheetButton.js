/**
 * Created by Ron on 1/6/2016.
 */
"use strict";
import ReactNative, {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {ThemeStyle} from './../../utils/CommonModules'
import React, { Component , PropTypes } from 'react';

const ButtonWidth = 60;
const IconWidth = 45;

class ShareActionSheetButton extends Component {
  // 默认属性
  static defaultProps = {};

  // 属性类型
  static propTypes = {
    imageSource: PropTypes.oneOfType([
      PropTypes.shape({
        uri: PropTypes.string,
      }),
      PropTypes.number,
    ]),
    name: PropTypes.string,
    handler: PropTypes.func,
  };

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  // 渲染
  render() {
    let {_theme} = this.props
    let textColor = ThemeStyle[_theme].color.defaultText
    return (
      <TouchableWithoutFeedback onPress={this.props.handler}>
        <View style={styles.container}>
          <Image source={this.props.imageSource} style={styles.icon}/>
          <Text style={[styles.text,{color:textColor}]} numberOfLines={1}>
            {this.props.name}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: ButtonWidth,
    height: 65,
  },
  icon: {
    width: IconWidth,
    height: IconWidth,
    alignSelf: 'center',
  },
  text: {
    marginTop: 5,
    fontSize: 11,
    color: 'rgb(91,91,91)',
    textAlign: 'center',
  },
});

export default ShareActionSheetButton;

ShareActionSheetButton.ButtonWidth = ButtonWidth;
ShareActionSheetButton.IconWidth = IconWidth;
