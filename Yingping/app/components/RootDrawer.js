/**
 * Created by Ron on 11/5/2016.
 */

import React, {Component, PropTypes} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

import Drawer from 'react-native-drawer'
import LeftMenu from './LeftMenu'
import HomePage from './HomePage'
import CommonModules,{
  DrawLeftMenuPercentage,
}from './../utils/CommonModules'

class RootDrawer extends Component {

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      drawerOpen: false,
      drawerDisabled: false,
    };
  }


  closeDrawer = () => {
    this._drawer.close()
    let { dispatchChangeTheme } = this.props;
    console.log(dispatchChangeTheme)
  }

  openDrawer = () => {
    this._drawer.open()

    let { dispatchChangeTheme } = this.props;
    console.log(dispatchChangeTheme)
  }

  // 渲染
  render() {

    var {closeDrawer, changeToTheme } = this.props;

    return (
      <Drawer ref={(ref) => {this._drawer = ref}}
              type="overlay"
              content={
                <LeftMenu {...this.props} closeDrawer={this.closeDrawer} />
              }
              acceptDoubleTap styles={{drawerStyles}}
              onOpen={() => {
                this.setState({drawerOpen: true})
              }}
              onClose={() => {
                this.setState({drawerOpen: false})
              }}
              captureGestures={'open'}
              tweenDuration={100}
              panThreshold={0}
              tapToClose={true}
              disabled={this.state.drawerDisabled}
              openDrawerOffset={1-DrawLeftMenuPercentage}
              closedDrawerOffset={() => 0}
              panOpenMask={0}
              tweenHandler={(ratio) => ({
                main: { opacity:(2-ratio)/2},
                drawer: { shadowOpacity: ratio },
                drawerOverlay: { opacity: (2-ratio)/2 },
              })}
              negotiatepan
              >
        <HomePage {...this.props}/>
        </Drawer>
    );
  }

}

const drawerStyles = StyleSheet.create({
  drawer: {
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 3
  },
  main: {
    paddingLeft: 3,
    shadowColor: "#000000",
    shadowOpacity: 1,
    shadowRadius: 7,
  },
  drawerOverlay: {
    backgroundColor: 'rgb(0,0,0)',
    opacity: 1,
  }
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  }
});

export default RootDrawer;