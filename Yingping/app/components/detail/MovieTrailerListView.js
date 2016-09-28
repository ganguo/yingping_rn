

import React, {
  Component,
  PropTypes,
} from 'react';
import {
  AppRegistry,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ListView,
  TouchableOpacity,
  Animated
} from 'react-native';
import CommonModules,{
  LoadingWidget,
  ThemeStyle,
  fetchMovieReview,
  statusHeight,
  MaterialIcons,
  screenHeight,
  GlobalTintColor
} from '../../utils/CommonModules'
import Video from './VideoPlayer/VideoPlayer'
import Presenter from 'react-native-presenter'
let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
let styles = StyleSheet.create({
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
});


export default class MovieTrailerListView extends React.Component{

  static defaultProps = {};
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      datas : new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      show: false,
      playingUrl : undefined,
      urls : undefined,
      translateY: new Animated.Value(screenHeight)
    };
  }

  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount(){}

  show(urls){
    let isArray = (urls instanceof Array && urls.length > 0)
    this.setState({
      show: isArray ? true : false,
      datas: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(isArray ? urls : []),
      playingUrl: isArray ? urls[0] : '',
      urls: urls
    })

    if (isArray) {
      setTimeout( ()=> {
        Animated.spring(
          this.state.translateY,         // Auto-multiplexed
          {toValue: 0} // Back to zero
        ).start();
        setTimeout(()=> {
          this.refs.video.playWithURL(this.state.playingUrl)
        },250)
      }, 500);
    }
  }

  dismiss(){
    Animated.spring(
      this.state.translateY,         // Auto-multiplexed
      {toValue: screenHeight} // Back to zero
    ).start();
    setTimeout(()=> {
      this.setState({show:false})
    },250)
  }

  renderRow(data,sectionID,rowID) {
    let {datas,playingUrl,urls} = this.state

    let url = datas.getRowData(0,rowID)
    let isPlaying = (playingUrl == url)


    let rowS = [{height:40,justifyContent:'center'}]
    let textS = {fontSize:13,marginLeft:15,color:isPlaying ? GlobalTintColor:'black'}
    return (
      <TouchableOpacity style={{flex:0}} onPress={()=>{
        this.setState({
          playingUrl: url,
          datas: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(urls),
        })
        setTimeout( ()=> {
          this.refs.video.playWithURL(this.state.playingUrl)
        }, 500);
      }}>
        <View style={rowS}>
          <Text style={textS}>
            {`预告片 ${Number(rowID) + 1}`}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderBar(){
    const myIcon = (<MaterialIcons name="keyboard-backspace" size={30} color="white" />)
    let barS = [{height: statusHeight + 20,backgroundColor:'black'}]
    return (
        <View style={barS}>
          <Presenter ref={(r)=>{this.presenter = r}}/>
        </View>
    )
  }

  render() {
    let {childrent,style} = this.props
    let {datas,show,playingUrl,translateY} = this.state
    if (show) {
      const videoS = [{height:SCREEN_WIDTH * (200 / 350)}]
      return(
        <Animated.View style={[styles.fillAbsolute,{backgroundColor:'white',transform:[{translateY:translateY}]}]}>
          {this.renderBar()}
          <View style={videoS}>
            <Video ref='video' closeAction={()=>{this.dismiss()}} style={videoS} />
          </View>
          <ListView
            style={styles.fill}
            dataSource={datas}
            renderRow={this.renderRow.bind(this)}
            keyboardDismissMode={'none'}
            showsHorizontalScrollIndicator={true}
            horizontal={false}
            showsVerticalScrollIndicator={true}
            renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => {
              return (<View key={rowID} style={{height:0.5,backgroundColor:'rgba(0,0,0,0.1)'}}></View>)
            }}
          />
        </Animated.View>
      )

    } else {
      return(<View style={{flex:0}}/>)
    }
  }


}
