/**
 * Created by Ron on 11/5/2016.
 */
"use strict";
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  Modal,
  Platform,
  NativeModules,
  StatusBar
} from 'react-native';
let AppActions = NativeModules.AppActions
import CommonModules, {
  ThemeStyle,
  DrawLeftMenuPercentage,
  DrawLeftMenuPostRatio,
  screenWidth,
  GGButton,
  HudView,
} from './../utils/CommonModules'

import React, {Component, PropTypes} from 'react'
import ItemCell from '../vendors/ItemCell'
import WebPage from './WebPage'
import { ThemeType } from './../constrants/ActionTypes'

class LeftMenu extends Component {
  // 属性类型
  static propTypes = {
    closeDrawer: React.PropTypes.func.isRequired
  };

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      items: ['清空缓存', '关于'],
      modalVisible: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
    this._renderRow = this._renderRow.bind(this)
    this._footView = this._footView.bind(this)
  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.items)
    });
  }

  _renderRow(rowData, rowID) {
    return (
      <ItemCell onPress={()=>{
        console.log(this,rowID,rowData)
        if (rowData == '清空缓存'){
          if(Platform.OS === 'ios'){
            this.refs.hudView.showCustomComponent(<Text style={{color:'#ffffff'}}>请稍等...</Text>)
            AppActions.cleanCacheWithresolver().then((success)=>{
              this.refs.hudView.showSuccess().then(() => {
                console.log("Success view did complete.")
              })
            })
          }else {

          }

        }else if(rowData == '关于'){
          this._setModalVisible(true)
        }
      }} {...this.props} showDisclosureIndicator={true}>
        {rowData}
      </ItemCell>
    )
  }

  _footView() {

    const { changeToTheme, _theme ,toggleUnreadSate, _unread} = this.props;

    const buttonWidth = screenWidth * DrawLeftMenuPercentage / 2

    const borderColor = ThemeStyle[_theme].color.cellSeparator

    const buttonContainerStyle = {
      backgroundColor: ThemeStyle[_theme].color.background,
      flexDirection: 'row',
      alignItems: 'center',
      width: buttonWidth,
      height: 55,
      borderTopColor: borderColor,
      borderTopWidth: 1,
    }

    const buttonImageStyle = {
      marginTop: 0,
      marginRight: 8,
      width: 20,
      height: 20
    }

    const buttonTextStyle = {
      color: ThemeStyle[_theme].color.menuText,
      fontSize: 14,
    }

    var buttonImageSource1
    var buttonImageSource2
    if (_theme == ThemeType.Night) {
      buttonImageSource1 = require('image!ic_readmode_night')
    } else {
      buttonImageSource1 = require('image!ic_readmode_day')
    }
    if (_unread === true) {
      buttonImageSource2 = require('image!ic_unreadcount_night')
    } else {
      buttonImageSource2 = require('image!ic_unreadcount_day')
    }

    return (
      <View style={{flexDirection: 'row', alignItems: 'stretch',margin: 0}}>
        <Modal
          animationType={'fade'}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {this._setModalVisible(false)}}
        >
          <WebPage {...this.props} navTitle="关于我们" openLink="http://ganguo.io" closeHandler={()=>{
            this._setModalVisible(false);
          }}/>
        </Modal>
        <GGButton containerStyle={[buttonContainerStyle,{borderRightColor: borderColor, borderRightWidth: 1}]}
          imageStyle={buttonImageStyle}
          text={'夜间'}
          textStyle={buttonTextStyle}
          imageSource={buttonImageSource1} handler={()=>{
          changeToTheme((this.props._theme == ThemeType.Night)? ThemeType.Normal : ThemeType.Night)
      }}/>
        <GGButton containerStyle={buttonContainerStyle}
                                imageStyle={buttonImageStyle}
                                text={'未读'}
                                textStyle={buttonTextStyle}
                                imageSource={buttonImageSource2} handler={()=>{
          toggleUnreadSate(!_unread)
      }}/>
        </View>
    )
  }

  // 渲染
  render() {
    StatusBar.setBarStyle('light-content',false)

    const { _theme } = this.props

    return (
      <HudView ref="hudView">
        <View style={styles.container}>
          <Image style={styles.image} source={require('./../resources/leftmenu-background.png')}>
            <View style={[styles.imageOverlay,{opacity: ThemeStyle[_theme].color.menuPostOpacity}]}/>
          </Image>
          <ListView style={[styles.container, {backgroundColor: ThemeStyle[_theme].color.background}]}
                    contentInset={{top: 20}}
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData, rowID) =>
                this._renderRow(rowData, rowID)}
          />
          {this._footView()}
        </View>
        </HudView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 0,
  },
  image: {
    marginTop: 0,
    marginLeft: 0,
    width: DrawLeftMenuPercentage * screenWidth,
    height: DrawLeftMenuPercentage * screenWidth / DrawLeftMenuPostRatio,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.65,
    backgroundColor: 'black',
  },
  controlText: {
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  }
})

export default LeftMenu;
