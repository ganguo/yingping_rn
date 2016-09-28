/**
 * Created by Ron on 20/4/2016.
 */
"use strict";
import RN, {
  StyleSheet,
  Text,
  View,
  Navigator,
  StatusBar,
  Platform,
  BackAndroid,
  AlertIOS,
} from 'react-native';

import React, {PropTypes,Component} from 'react'
import NavigationBar from 'react-native-navbar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import InTheaters from './home/InTheaters'
import Top250 from './home/Top250'
import UsBox from './home/UsBox'
import Searchpage from './search/SearchPage'
import ThemeType from './../constrants/ActionTypes'
import MovieReviewDetail from './detail/MovieReviewDetail'

import CommonModules, {
  ThemeStyle,
  GlobalTintColor,
  statusHeight,
  GlobalStyle,
  MaterialIcons,
  GGButton,
  fetchMovieReview,
} from '../utils/CommonModules'

class HomePage extends Component {
  // 默认属性
  static defaultProps = {};

  // 属性类型
  static propTypes = {};

  static contextTypes = {
    drawer: PropTypes.object.isRequired,
  };

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
    // this._test();
  }

  _test() {
    fetchMovieReview('2131940', 0, (result, error)=> {
      if (result) {
        this._nav.push({
          component: MovieReviewDetail,
          params: {
            reviews: result['reviews'][0]
          },
        })
      }
    })
  }


  // 渲染
  render() {
    let defaultName = 'MainPage';
    let defaultComponent = MainPage;

    return (
      <Navigator ref={(ref)=>{this._nav = ref}}
                 key="home-navigator"
                 initialRoute={{ name: defaultName, component: defaultComponent }}
                 onWillFocus={(event) => {
            let routeComponent = event.component
            if (routeComponent && this._nav){
                var routes = this._nav.state.routeStack;
                var currentRoute = routes[routes.length-1]
                if (currentRoute.params){
                    let title = 'params has ' + Object.getOwnPropertyNames(currentRoute.params).sort();
                   //AlertIOS.prompt(title)
                }
                if(currentRoute.params && currentRoute.params.backHandler){
                  console.log('back to MovieDetail')
                  currentRoute.params.backHandler()
                }
            }
        }}
                 onDidFocus={(event)=>{
          StatusBar.setBarStyle('light-content',false)
        }}
                 renderScene={(route, navigator) => {
          let Component = route.component;
          let params = route.params;
          return <Component {...this.props} params={params} navigator={navigator}/>
        }}
      />
    );

  }

}

class MainPage extends Component {
  // 默认属性
  static defaultProps = {};

  // 属性类型
  static propTypes = {};

  static contextTypes = {
    drawer: PropTypes.object.isRequired,
  };

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  // component mount callback
  componentDidMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroidCallback);
    }
  }

  // component unmount callback
  componentWillUnMount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroidCallback);
    }
  }

  /*Android 物理键盘回退键的回调*/
  onBackAndroidCallback = () => {
    // console.log(this)
    const nav = this.props.navigator;
    console.log("trigger back callback");
    if (nav && nav.getCurrentRoutes().length > 1) {
      console.log("返回上一页");
      nav.pop();
      return true;
    }
    return false;
  }

  // 渲染
  render() {

    StatusBar.setBarStyle('light-content', false)

    const leftButtonConfig = {
      title: 'Menu',
      handler: () => {
        console.log(this.context.drawer)
        this.context.drawer.open()
      },
    };

    const rightButtonConfig = {
      title: 'Search',
      handler: () => {
        this.props.navigator.push({
          component: Searchpage,
        })
      },
    };

    const titleConfig = {
      title: '甘豆影评',
      tintColor: 'white',
    };

    const menuButtonConfig = {
      component: GGButton.buildLeftButtonWithIcon(<MaterialIcons
        name="menu"
        size={30} color="#ffffff"/>, () => {

        this.context.drawer.open()

      }),
    };

    const searchButtonConfig = {
      component: GGButton.buildRightButtonWithIcon(<MaterialIcons
        name="search"
        size={30} color="#ffffff"/>, () => {

        this.props.navigator.push({
          component: Searchpage,
        })

      }),
    };

    const { _theme } = this.props;
    const navigationBarTintColor = ThemeStyle[_theme].color.navigationBarTint
    const tabBarUnderlineColor = ThemeStyle[_theme].color.tabBarUnderlineColor
    const tabBarInActiveColor = ThemeStyle[_theme].color.tabBarInactiveTextColor
    const listBackgroundColor = ThemeStyle[_theme].color.listBackground
    return (
      <View style={[viewStyle.container,GlobalStyle.commonContainer,{backgroundColor:listBackgroundColor}]}>
        <NavigationBar key="homenavbar" style={{marginTop:statusHeight}} tintColor={navigationBarTintColor}
                       title={titleConfig} leftComponent={menuButtonConfig} rightComponent={searchButtonConfig}/>
        <ScrollableTabView tabBarBackgroundColor={navigationBarTintColor} tabBarUnderlineColor={tabBarUnderlineColor}
                           tabBarActiveTextColor={tabBarUnderlineColor} tabBarInactiveTextColor={tabBarInActiveColor}
                           tabBarTextStyle={{fontSize: 16}}>
          <InTheaters {...this.props} tabLabel="正在热播" navigator={this.props.navigator}/>
          <Top250 {...this.props} tabLabel="Top250" navigator={this.props.navigator}/>
          <UsBox {...this.props} tabLabel="北美票房榜" navigator={this.props.navigator}/>
        </ScrollableTabView>
      </View>
    );
  }

}


const viewStyle = StyleSheet.create({

  container: {
    flex: 1,
  },

  textfield: {
    flex: 1,
  },

});


export default HomePage;
