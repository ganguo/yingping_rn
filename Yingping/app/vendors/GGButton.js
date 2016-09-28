/**
 * Created by Ron on 25/5/2016.
 */
import ReactNative, {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import {statusBarHeight} from '../constrants/global-constants';
import React, { Component , PropTypes } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class GGButton extends Component {
  // 默认属性
  static defaultProps = {};

  // 属性类型
  static propTypes = {
    iconSource: PropTypes.element,
    imageSource: PropTypes.oneOfType([
      PropTypes.shape({
        uri: PropTypes.string,
      }),
      PropTypes.number,
    ]),
    imageStyle: PropTypes.any,
    text: PropTypes.string,
    containerStyle: PropTypes.any,
    textStyle: PropTypes.any,
    handler: PropTypes.func,
  };

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  // 自定义方法
  handle() {

  }

  getImageElement() {
    const { imageSource, iconSource, imageStyle} = this.props;

    if (imageSource) {
      return (
        <Image
          style={[styles.imageStyle, imageStyle]}
          resizeMode="contain"
          source={imageSource}
        />
      )
    } else if (iconSource) {
      return (
        <View style={[styles.imageStyle, imageStyle]}>
          {iconSource}
        </View>
      )
    } else {
      return null;
    }

  }

  // 渲染
  render() {

    const { imageSource, containerStyle, iconSource,textStyle, imageStyle, text, handler } = this.props;

    return (
      <TouchableOpacity style={styles.container} onPress={handler}>
        <View style={[ styles.container, containerStyle]}>
          {this.getImageElement()}
          <Text style={[styles.textStyle, textStyle]}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    marginTop: statusBarHeight,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: '#0076FF',
  },
});

export default GGButton;


function buildBackButton(callback) {
  var backIcon = ( <MaterialIcons
    name="keyboard-backspace"
    size={30} color="#ffffff"/> );

  var backButton = <GGButton imageStyle={{marginLeft:10, width: 30, height: 30}} iconSource={backIcon} handler={callback}/>;

  return backButton;
}

function buildLeftButtonWithIcon(icon,callback){
  var leftButton = <GGButton imageStyle={{marginLeft:10, width: 28, height: 28}} iconSource={icon} handler={callback} />;
  return leftButton;
}

function buildLeftButton(source,callback){
  var leftButton = <GGButton imageStyle={{marginLeft: 10, width: 28, height: 28}} imageSource={source} handler={callback}/>;
  return leftButton;
}

function buildRightButtonWithIcon(icon,callback) {
  var rightButton = <GGButton imageStyle={{marginRight:10, width: 28, height: 28}} iconSource={icon} handler={callback}/>;
  return rightButton;
}

function buildRightButton(source,callback){
  var rightButton = <GGButton imageStyle={{marginRight:10, width: 28, height: 28}} imageSource={source} handler={callback}/>;
  return rightButton;
}

GGButton.buildBackButton = buildBackButton;
GGButton.buildLeftButton = buildLeftButton;
GGButton.buildLeftButtonWithIcon = buildLeftButtonWithIcon;
GGButton.buildRightButton = buildRightButton;
GGButton.buildRightButtonWithIcon = buildRightButtonWithIcon;
