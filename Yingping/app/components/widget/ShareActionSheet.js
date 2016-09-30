/**
 * Created by Ron on 1/6/2016.
 */
"use strict";
import ReactNative, {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  NativeModules,
  Platform
} from 'react-native';

import Symbol from 'es6-symbol'
import React, { Component , PropTypes } from 'react';
import CommonModules,{
  screenWidth,
  statusHeight,
  GlobalStyle,
  screenHeight,
  ThemeStyle,
} from '../../utils/CommonModules'
import ShareActionSheetButton from './ShareActionSheetButton'
const IconMargin = (screenWidth - ShareActionSheetButton.IconWidth * 4) / 5;
var ShareManager = NativeModules.ShareManager;
const SelfHeight = 206;

const ShareType = {
  Weibo: Symbol('Weibo'),
  Wechat: Symbol('Wechat'),
  Moment: Symbol('Moment'),
  QQ: Symbol('QQ'),
}

class ShareActionSheet extends Component {
  // 默认属性
  static defaultProps = {
    type: ShareType.Weibo,
  };

  // 属性类型
  static propTypes = {
    shareObject: PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
      url: PropTypes.string,
    }),
    type: PropTypes.any,
    handler: PropTypes.func,
  };

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      onShow: false,
      maskViewAlpha: new Animated.Value(0),
      allowShareTypes: [],
    };
    this.dismissAction = this.dismissAction.bind(this);
    this.didSelectedType = this.didSelectedType.bind(this);
    this._getAllowShareTypesFromPlaforms()
  }

  didSelectedType(shareType) {
    this._shareInPlaformsByType(shareType)
    //this.props.handler(shareType)
  }

  showAction() {
    if (this.state.allowShareTypes.length > 0) {
      this.setState({
        onShow: true,
      });

      Animated.timing(this.state.maskViewAlpha, {
        toValue: 0.3,
        duration: 250,
      }).start();

    } else {
      console.log('手机没有安装分享应用')
    }
  }

  dismissAction() {

    Animated.timing(this.state.maskViewAlpha, {
      toValue: 0,
      duration: 200,
    }).start(()=>{
      this.setState({
        onShow: false,
      });
    });

  }

  renderShareButtonBy(shareType) {
    if (this.state.allowShareTypes.some(type => {

        return type === shareType

      })) {

      let name;
      let imageSource;
      switch (shareType) {
        case ShareType.Wechat:
          name = '微信';
          imageSource = require('./../../resources/share-icon-wechat.png');
          break;
        case ShareType.Moment:
          name = '微信朋友圈';
          imageSource = require('./../../resources/share-icon-moment.png');
          break;
        case ShareType.QQ:
          name = 'QQ';
          imageSource = require('./../../resources/share-icon-qq.png');
          break;
        default:
          name = '新浪微博';
          imageSource = require('./../../resources/share-icon-weibo.png');
          break;
      }

      return <ShareActionSheetButton {...this.props} imageSource={imageSource} name={name} handler={()=> {
                  this.didSelectedType(shareType)
                }}/>
    }
    return null
  }

  renderShareView() {

    let {_theme} = this.props
    let backgroundColor = ThemeStyle[_theme].color.shareViewBackgroundColor
    let textColor = ThemeStyle[_theme].color.defaultText

    if (this.state.onShow) {
      return (
        <View style={[styles.container,{backgroundColor: 'transparent'}]}>
          <TouchableWithoutFeedback onPress={this.dismissAction}>
            <Animated.View style={[GlobalStyle.fullScreenStyle, {
              backgroundColor: 'black',  opacity: this.state.maskViewAlpha,
            }]}/>
          </TouchableWithoutFeedback>
          <Animated.View style={[styles.bottomContainer,{backgroundColor:backgroundColor},{
            transform: [{
              translateY: this.state.maskViewAlpha.interpolate({
                inputRange: [0,0.3],
                outputRange: [0,-SelfHeight]
              }),
            }]
          }]}>
            <Text style={[styles.topTitle,{color:textColor}]}>分享到</Text>
            <View style={[styles.line,{backgroundColor:textColor}]}></View>
            <View style={styles.buttonContainer}>
              <View style={styles.buttonSubContainer}>
                {this.renderShareButtonBy(ShareType.Weibo)}
                {this.renderShareButtonBy(ShareType.Wechat)}
                {this.renderShareButtonBy(ShareType.Moment)}
                {this.renderShareButtonBy(ShareType.QQ)}
              </View>
            </View>
          </Animated.View>
        </View>
      )
    } else {
      return null;
    }
  }

  // 渲染
  render() {


    return (
      <View style={styles.container}>
        <View style={GlobalStyle.fullScreenStyle}>
          {this.props.children}
        </View>
        {this.renderShareView()}
      </View>
    );

  }

  _getAllowShareTypesFromPlaforms() {
    if (Platform.OS === 'android') {
      this.allowShareTypes = [ShareType.Weibo]
    } else {

      //暂时移除分享功能
      this.allowShareTypes = []
      return;

      ShareManager.getShareTypesSupport('key').then((allShareTypes) => {

        let types = []
        if (allShareTypes.weibo) {
          types.push(ShareType.Weibo)
        }
        if (allShareTypes.wechat) {
          types.push(ShareType.Wechat, ShareType.Moment)
        }
        if (allShareTypes.qq) {
          types.push(ShareType.QQ)
        }

        this.setState({
          allowShareTypes: types
        })

      }, ()=> {
      })

    }

  }


  _shareInPlaformsByType(shareType) {
    switch (shareType) {
      case ShareType.QQ:
        this.actionShare(ShareManager.QQ);
        break;
      case ShareType.Wechat:
        this.actionShare(ShareManager.Wechat);
        break;
      case ShareType.Moment:
        this.actionShare(ShareManager.Moment);
        break;
      default:
        this.actionShare(ShareManager.Weibo);
    }
  }

  actionShare(type){
    if(Platform.OS === 'android'){
      ShareManager.shareContent(this.props.shareObject,type);
    }else{
      /*
      ShareManager.shareContent(this.props.shareObject,type).then(()=> {
        console.log('分享成功')
        this.refs.hudView.showSuccess()
      }, (errerStateStr)=> {
        this.refs.hudView.showError()
        console.log(errerStateStr)
      })
      console.log(ShareManager.Weibo)
      */
    }
  }


}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgb(250,250,250)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  line: {
    backgroundColor: 'rgb(217,217,217)',
    height: 1,
    marginHorizontal: IconMargin,
  },
  topTitle: {
    fontSize: 18,
    color: 'rgb(75,75,75)',
    textAlign: 'center',
  },
  buttonContainer: {
    marginHorizontal: IconMargin - (ShareActionSheetButton.ButtonWidth - ShareActionSheetButton.IconWidth) / 2,
  },
  buttonSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomContainer: {
    width: screenWidth,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    height: SelfHeight,
    paddingVertical: IconMargin,
    marginBottom: -SelfHeight,
  },
});

module.exports = {ShareType, ShareActionSheet}
