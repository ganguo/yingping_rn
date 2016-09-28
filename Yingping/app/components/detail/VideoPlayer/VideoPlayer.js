

import React, { Component,PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions
} from 'react-native';
import Video from 'react-native-video'
import Presenter from 'react-native-presenter'
import Icon from 'react-native-vector-icons/Entypo';
import AwesomIcon from 'react-native-vector-icons/FontAwesome';


import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './source/video_fontello/config.json';
const VideoIcon = createIconSetFromFontello(fontelloConfig);


const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const SHADOW_COLOR = 'rgba(0,0,0,0)'
const viewStyle = StyleSheet.create({
  center:{
    alignItems:'center',
    justifyContent:'center',
  },
  fill:{
    flex:1,
  },
  absolute:{
    position: 'absolute',
  },
  fillAbsolute:{
    position: 'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
  },
  barS : {
    height:30,
    backgroundColor:'rgba(0,0,0,0.5)',
    borderTopWidth:0,
    borderColor:'white',
    alignItems:'stretch',
    flexDirection:'row',
    justifyContent:'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
  }
})


export default class VideoPlayer extends React.Component {

  static defaultProps = {
    paused : true,
    videoURL: undefined,
    closeAction: ()=>{}
  };


  static propTypes = {
    paused : PropTypes.bool,
    videoURL: PropTypes.string,
    closeAction: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      paused : props.paused,
      showControl: true,
      loading : false,
      playingURL : undefined,
      canLoad : false,
      opacity : new Animated.Value(0),
    };

    this.playWithURL = this.playWithURL.bind(this)
  }

  play(){
    this.setState({
      paused:false,
    })
  }

  paused(){
    this.setState({
      paused:true
    })
  }

  _testPlay(){
    //console.log('test');
  }

   playWithURL(url?:String){
    //console.log(this);
    this.setState({
      playingURL:url,
      paused:false,
    })
    setTimeout(() =>{
      //console.log(this);
    }, 1000);
  }

   setVideoURL(url?:String){
    this.setState({playingURL:url})
  }

  componentDidMount(){
    this.showControlBar()
  }

  componentWillUnmount(){
    let {opacity} = this.state
    this.state.opacity.removeAllListeners();
  }

  loadStart(e) {
    this.setState({loading:true})
  }

  setDuration(e){
    this.setState({loading:true})
  }

  setTime(obj) {
    //console.log('time');
    let {currentTime,playableDuration} = obj
    this.setState({loading:currentTime >= playableDuration})
  }

  onEnd(e) {
    //console.log('onEnd');
    this.setState({paused:true,})
  }

  videoError(e) {
    //console.log(videoError);
    alert('读取视频资源失败')
  }

  showControlBar(){
    if (this.state.opacity._value == 1) {
      this.state.opacity.stopAnimation(()=>{
        Animated.spring(this.state.opacity,{toValue:0,duration: 250}).start()
      })
    } else {
      this.state.opacity.stopAnimation(()=>{
        Animated.sequence([
          Animated.spring(this.state.opacity,{toValue:1,duration: 250}),
          Animated.delay(2000),
          Animated.spring(this.state.opacity,{toValue:0,duration: 250})
        ]).start()
      })
    }
  }

  renderTouch(){
    let {paused,showControl} = this.state
    let touchS = [{position:'absolute' ,top:0, left:0, bottom:0, right: 0},{backgroundColor:(showControl||paused)?SHADOW_COLOR:'rgba(0,0,0,0)'}]
    return(
      <Animated.View style={touchS}>
        <TouchableOpacity
          style={{flex:1}}
          onPress={()=>{
            this.showControlBar()
          }}
        />
      </Animated.View>
    )
  }

  renderTopBar() {
    let{paused,opacity} = this.state
    let{closeAction} = this.props;
    let topBarS = [viewStyle.barS,{top:0,opacity:opacity}];
    let closeIconS = [{marginTop:4,marginLeft:10},viewStyle.center]

    let closeButton = (
      <TouchableOpacity style={closeIconS} onPress={()=>{
        if (opacity._value == 0) { return;}
        closeAction()
      }}>
        <AwesomIcon name="close" size={20} color="white" />
      </TouchableOpacity>
    );
    return (
      <Animated.View style={topBarS}>
        {closeButton}
      </Animated.View>
    )
  }

  renderBottomBar(){
    let{paused,opacity,playingURL} = this.state

    if (playingURL == undefined) return

    let bottomBarS = [viewStyle.barS,{bottom:0,opacity:opacity}];
    let leftIconS = [{marginTop:4,marginLeft:10},viewStyle.center]
    let rightIconS = [{marginTop:4,marginRight:10},viewStyle.center]
    let PlayButtton =(
      <TouchableOpacity style={leftIconS} onPress={()=>{
        if (opacity._value == 0) { return;}
        this.play()
      }}>
        <Icon name="controller-play" size={20} color="white" />
      </TouchableOpacity>
    );

    let PauseButton = (
      <TouchableOpacity style={leftIconS} onPress={()=>{
        if (opacity._value == 0) { return;}
        this.paused()
      }}>
        <Icon name="controller-paus" size={20} color="white" />
      </TouchableOpacity>
    );

    let FullButton = (
      <TouchableOpacity style={rightIconS} onPress={()=>{
        if (opacity._value == 0) return
        this.video.presentFullscreenPlayer()
      }}>
        <Icon name="resize-full-screen" size={20} color="white" />
      </TouchableOpacity>
    );

    let LeftButton = !paused ? PauseButton : PlayButtton
    let RightButton = FullButton

    return (
      <Animated.View style={bottomBarS}>
        {LeftButton}
        {RightButton}
      </Animated.View>
    )
  }

  renderLoading(){
    let content = {position:'absolute' ,top:0, left:0, bottom:0, right: 0,backgroundColor:SHADOW_COLOR,justifyContent:'center',alignItems:'center'}
    let {paused,loading,showControl} = this.state
    if (!loading || paused) {
      return
    } else {
      return(
        <View style={content}>
          <ActivityIndicator
            animating={true}
            color={'white'}
            size={'large'}
          />
        </View>
      );
    }
  }

  renderVideo(){
    let {paused,showControl,playingURL,canLoad} = this.state
    if (playingURL != undefined) {
      return(
        <Video
          ref={(ref)=>this.video = ref}
          source={{uri: playingURL}}     // Can be a URL or a local file.
          rate={1.0}                   // 0 is paused, 1 is normal.
          volume={1.0}                 // 0 is muted, 1 is normal.
          muted={false}                // Mutes the audio entirely.
          paused={paused}              // Pauses playback entirely.
          resizeMode={'contain'}         // Fill the whole screen at aspect ratio.
          repeat={true}                // Repeat forever.
          playInBackground={false}     // Audio continues to play when app entering background.
          playWhenInactive={false}     // [iOS] Video continues to play when control or notification center are shown.
          onLoadStart={this.loadStart.bind(this)} // Callback when video starts to load
          onLoad={this.setDuration.bind(this)}    // Callback when video loads
          onProgress={this.setTime.bind(this)}    // Callback every ~250ms with currentTime
          onEnd={this.onEnd.bind(this)}           // Callback when playback finishes
          onError={this.videoError.bind(this)}    // Callback when video cannot be loaded
          style={viewStyle.fillAbsolute} />
      )
    } else {
      return
    }
  }

  render() {
    let containerS = [{flex:1, backgroundColor:'black',justifyContent:'center',alignItems:'center'}]
    return(
      <View style={containerS}>
        {this.renderVideo()}
        {this.renderLoading()}
        {this.renderTouch()}
        {this.renderTopBar()}
        {this.renderBottomBar()}
      </View>
    );
  }
}
