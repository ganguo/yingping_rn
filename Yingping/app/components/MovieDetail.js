"use strict";
import RN, {
  StyleSheet,
  Text,
  View,
  Platform,
  Navigator,
  Image,
  BackAndroid,
  TouchableNativeFeedback,
  TouchableOpacity,
  StatusBar,
  NativeModules,
  Modal,
  Animated,
  Alert
} from 'react-native';

import React, {PropTypes,Component} from 'react'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import MovieReview from './detail/MovieReview'
import MovieComment from './detail/MovieComment'
import VideoList from './detail/MovieTrailerListView'

import CommonModules,{
  fetchMoviePic,
  ThemeStyle,
  dismissKeyboard,
  screenWidth,
  statusHeight,
  statusBarHeight,
  GGButton,
  MaterialIcons,
  screenHeight,
  FontAwesome,
  fetchMovieInfo,
  HudView,
  GlobalTintColor,
  LoadingWidget,

} from '../utils/CommonModules'
import StarRatingBar from './widget/StarRatingBar'
import MoviePhotoBrowser from './detail/MoviePhotoBrowser'
import MoviePage from './detail/MoviePage'
import LinearGradient from 'react-native-linear-gradient'

var TouchableElement = TouchableOpacity;
if (Platform.OS === 'android') {
  TouchableElement = TouchableNativeFeedback;
}

class MovieDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      movieInfo: props.params.movie,
      moviePic: null,
      infoLoaded: false,
      picLoaded: false,
      translateValue:new Animated.Value(screenWidth * 0.59),
      opacityValue:new Animated.Value(0),
      finishAnim:true,
      animScrollY:0,
    };
  }

  //组件挂载的时候调用
  componentDidMount() {
    const id = this.props.params.movie.id;

    /*请求详情数据*/
    fetchMovieInfo(id, (json, error) => {
      if (error) {
        console.log(error)
      } else {
        this.setState({
          movieInfo: json,
          infoLoaded: true,
        });
        this.fetchMoviePicture(json)
      }
    })
  }


  componentWillUnmount() {
    if (Platform.OS === 'android'){
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroidCallback);
    }
    StatusBar.setBarStyle('light-content',false)
  }

  /*Android 物理键盘回退键的回调*/
  onBackAndroidCallback = () => {
    // console.log(this)
    const nav = this.props.navigator;
    // console.log(nav);
    if (nav && nav.getCurrentRoutes().length > 1) {
      console.log("返回上一页");
      nav.pop();
      return true;
    }
    return false;
  }

  /*请求剧照数据*/
  fetchMoviePicture(dataSource) {
    const movieInfo = dataSource;
    const id = movieInfo.id;
    fetchMoviePic(id, (json, error) => {
      if (error) {
        console.log(error)
      } else {
        this.setState({
          moviePic: json,
          picLoaded: true,
        });
      }
    })
  }

  render() {

    StatusBar.setBarStyle('light-content',false)

    var backIcon = <MaterialIcons
      name="keyboard-backspace"
      size={30} color="#ffffff"/>;

    var shareIcon = <MaterialIcons
      name="more-vert"
      size={30} color="#ffffff"/>;

    const leftBtnConfig = {
      component: GGButton.buildLeftButtonWithIcon(backIcon, () => {
        dismissKeyboard()
        this.props.navigator.pop()
      }),
    };

    const rightBtnConfig = {
      component: GGButton.buildRightButtonWithIcon(shareIcon, () => {
        this.props.navigator.push({
          component: MoviePage,
          params : {
            movieId : this.props.params.movie.id
          }
        })
      }),
    };

    var contentView;
    if (!this.state.infoLoaded) {
      contentView = this.renderLoadingView(leftBtnConfig, rightBtnConfig);
    } else {

      var movieInfo = this.state.movieInfo;
      var moviePic = this.state.moviePic;

      contentView = this.renderMovieDetail(leftBtnConfig, rightBtnConfig, movieInfo, moviePic);
    }

    return (
      <HudView ref={(h) => {
        if (h != null) {
          this._hudView = h;
        }
      }}>
        <View style={styles.container}>
          {contentView}
        </View>
        <VideoList ref={(r)=>{this.videoList = r}}/>
      </HudView>
    );
  }

  renderPlayButton(){
    let style = {position:'absolute',height:80,left:0,right:0,bottom:80,alignItems:'center',justifyContent:'center'};
    let trailer_urls = this.state.movieInfo.trailer_urls
    return(
      <View style={style}>
        <TouchableOpacity style={{flex:0}} onPress={()=>{
          if (trailer_urls != undefined) {
            this.videoList.show(trailer_urls)
          } else {
            Alert.alert(
            '提示',
            '没有预告片资源',
            [{text: '确认', onPress: () => console.log('OK Pressed!')},])
          }
        }}>
          <Image source={require('../resources/btn-play.png')}/>
        </TouchableOpacity>

      </View>
    )
  }

  /* 渲染bar */
  renderDetailBar(leftBtnConfig, rightBtnConfig,title) {
    let {_theme} = this.props
    let barDefaultColor = ThemeStyle[_theme].color.navigationBarTint
    return (
      <Animated.View style={[styles.barStyle,{
        backgroundColor:this.state.opacityValue.interpolate({
          inputRange: [0,1],
          outputRange: ['rgba(0,0,0,0)',barDefaultColor],
        })}]}>
        {leftBtnConfig.component}
        <Animated.Text
          style={[styles.titleStyle,
            {opacity: this.state.opacityValue}]}>
          {title}
        </Animated.Text>
        {rightBtnConfig.component}
      </Animated.View>
    );
  }

  /* 渲染头部图片View */
  renderDetailPic(leftBtnConfig, rightBtnConfig, movieInfo, moviePic) {
    let ratingMax = movieInfo.rating.max
    let ratingAverage = movieInfo.rating.average
    let ratingForMaxFiveStar = ratingAverage / ratingMax * 5
    let picTotal = 0;
    if (this.state.picLoaded) {
      picTotal = moviePic.total;
      if (picTotal >= 50) {
        picTotal = 50
      }
    }
    return (
      <Animated.Image
        style={{
          width: screenWidth,
          height: this.state.translateValue,
          backgroundColor: 'grey',
        }}
        source={{uri: movieInfo.images.large}}>
        {this.renderDetailBar(leftBtnConfig, rightBtnConfig, movieInfo.title)}
        <View style={{flex:1}}></View>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.7)']}
          style={styles.linearGradient}>
          <Text style={{color:'white',marginLeft:6,fontSize:20,fontWeight: 'bold'}}>{movieInfo.title}</Text>
          <View style={{flexDirection:'row'}}>
            <StarRatingBar style={styles.starRatingbar}
              userInteractionEnabled={false}
              starCount={ratingForMaxFiveStar}
              defineStarColor='white'/>
            <Text style={{color:'white',marginLeft:6,fontSize:20}}>{ratingAverage}</Text>
          </View>
          <View style={{marginLeft:6,marginBottom:6}}>
            <TouchableOpacity onPress={()=>{
              this.props.navigator.push({
                component: MoviePhotoBrowser,
                params : {
                  movieId : this.props.params.movie.id
                }
              })
            }}>
              <Text style={{color:'white'}}>{picTotal}张剧照</Text>
            </TouchableOpacity>
          </View>

        </LinearGradient>
        {this.renderPlayButton()}
      </Animated.Image>
    );
  }

  /* 请求接口loading数据时显示的view */
  renderLoadingView(leftBtnConfig, rightBtnConfig) {
    let {_theme} = this.props
    let backgroundColor = ThemeStyle[_theme].color.listBackground
    return (
      <View style={[styles.container,{backgroundColor:backgroundColor}]}>
        {this.renderDetailBar(leftBtnConfig, rightBtnConfig,"")}
        <LoadingWidget {...this.props}/>
      </View>
    );
  }

  renderMovieDetail(leftBtnConfig, rightBtnConfig, movieInfo, moviePic) {
    let {_theme} = this.props
    let backgroundColor = ThemeStyle[_theme].color.movieTabbarBackground
    let tabBarTintColor = ThemeStyle[_theme].color.movieTabbarUnderLine
    let tabBarUnactiveColor = ThemeStyle[_theme].color.movieTabbarInActiveText
    return (

      <View style={[styles.container,{backgroundColor:backgroundColor}]}>
        {this.renderDetailPic(leftBtnConfig, rightBtnConfig, movieInfo, moviePic)}
        <ScrollableTabView tabBarBackgroundColor={backgroundColor} tabBarUnderlineColor={tabBarTintColor}
          tabBarActiveTextColor={tabBarTintColor}
          tabBarInactiveTextColor={tabBarUnactiveColor}
          tabBarTextStyle={{fontSize: 16}}>
          <MovieReview
            {...this.props}
            ref={(movieReview) => {
              if (movieReview !== null) {
                this._movieReview = movieReview;
              }
            }}
            tabLabel="影评"
            navigator={this.props.navigator}
            id={movieInfo.id}
            movieTitle={movieInfo.title}
            onScroll={(e)=>{
              const scrollY = e.nativeEvent.contentOffset.y;
              this.onScrollListener(scrollY);
            }}/>
          <MovieComment {...this.props}
            tabLabel="短评"
            navigator={this.props.navigator}
            id={movieInfo.id}
            onScroll={(e)=>{
              const scrollY = e.nativeEvent.contentOffset.y;
              this.onScrollListener(scrollY);
            }}/>
        </ScrollableTabView>
        <TouchableOpacity style={styles.floatActionButton}
            onPress={() => {
              console.log("random read button pressed");
              if (this._movieReview !== null) {
                // trigger randomRead by movieReview instance
                this._movieReview.randomRead();
              }
            }}>
          <FontAwesome
            name="random"
            size={25} color="#ffffff"/>
        </TouchableOpacity>
      </View>
    )
  }

/**onScroll的监听**/
  onScrollListener(scrollY){
    this.state.animScrollY=scrollY;
    if(this.state.finishAnim){
      this.state.finishAnim = false;
      if(scrollY>=300){
        this.renderHideAnim(scrollY);
      }else{
        this.renderShowAnim(scrollY);
      }
    }
  }

/** 恢复原样动画 **/
  renderShowAnim(scrollY) {
    /**parallel为同时执行里面的两个动画**/
    Animated.parallel([
    Animated.spring(this.state.translateValue, {
      toValue: screenWidth * 0.59, // 目标值
      duration: 200, // 动画时间
    }),
    Animated.spring(this.state.opacityValue, {
      toValue: 0, // 目标值
      duration: 200, // 动画时间
    })
    ]).start(()=>this.finishAnimOpera(scrollY));
  }

/** 收缩动画 **/
  renderHideAnim(scrollY) {
    /**parallel为同时执行里面的两个动画**/
    Animated.parallel([
    Animated.spring(this.state.translateValue, {
      toValue: 50+statusHeight+statusBarHeight, // 目标值
      duration: 200, // 动画时间
    }),
    Animated.spring(this.state.opacityValue, {
      toValue: 1, // 目标值
      duration: 200, // 动画时间
    })
  ]).start(()=>this.finishAnimOpera(scrollY));
  }

  finishAnimOpera(scrollY){
    this.state.finishAnim = true;
    if(scrollY-this.state.animScrollY>30){
      this.onScrollListener(this.state.animScrollY);
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  barStyle: {
    height: 50+statusHeight+statusBarHeight,
    flexDirection: 'row',
    paddingTop: statusHeight,
  },
  titleStyle:{
    fontSize:17,
    color:"white",
    textAlign: 'left',
    marginLeft:30,
    marginTop:statusBarHeight,
    fontWeight: 'bold',
    flex:1,
    alignSelf:"center",
  },
  floatActionButton: {
    position: 'absolute',
    bottom: 26,
    right: 9,
    backgroundColor: '#ff6347',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieStills: {
    width: screenWidth,
    height: screenWidth * 0.59,
    backgroundColor: 'grey',
  },
  starRatingbar: {
    marginLeft: 6,
    alignItems: 'center',
  },
  textButtonStyle: {
    position: 'absolute',
    top: 50,
    right: 100,
    width: 50,
    height: 50,
  },
  datePickerContainer: {
    width: screenWidth,
    height: 206,
  },
  linearGradient: {
    width: screenWidth,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
});
//导出场景，供外部require
export default MovieDetail;
