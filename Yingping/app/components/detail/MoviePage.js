import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import CommonModules,{
  ThemeStyle,
  dismissKeyboard,
  statusBarHeight,
  GlobalTintColor,
  GGButton,
  statusHeight,
  GlobalStyle,
  MaterialIcons,
  fetchMovieInfo,
  LoadingWidget
} from '../../utils/CommonModules'
import ActorPage from './ActorPage'
import TitleBar from './Bar/TitleBar'

export default class MoviePage extends React.Component{
  constructor(props){
		super(props);

    let {_theme} = props

		let dataSeource = new ListView.DataSource({
		  rowHasChanged : (oldRowData,newRowData)=>oldRowData!==newRowData,
		});
		this.state = ({
			dataSeource : dataSeource,
      movieId : props.params.movieId,
      movie : undefined,
      loading : true,

      barStyle : ThemeStyle[_theme].statusBar,
      darkTextColor : ThemeStyle[_theme].color.movieCommentDarkText,
      backgroundColor : ThemeStyle[_theme].color.background,
      actorBG : ThemeStyle[_theme].color.movieActorbackgroundColor,
      titlebarBackgroundClolor : ThemeStyle[_theme].color.titlebarBackgroundClolor,
      movieActorLinecolor : ThemeStyle[_theme].color.movieActorLinecolor,
      movieActorTextColor : ThemeStyle[_theme].color.movieActorTextColor,
      movieActorTitleColor : ThemeStyle[_theme].color.movieActorTitleColor,
		});
	}

  componentDidMount(){
    fetchMovieInfo(this.state.movieId,(json,error)=>{
      if (error == undefined) {
        //console.log(json);
        //演人数据
        let actors = this._createActorArray(json);
        this.setState({
          dataSeource : this.state.dataSeource.cloneWithRows(actors),
          movie : json,
          loading : false,
        })
      } else {
        console.log(error);
      }
    });
  }

  _createActor(obj,rote) {
    return {
      name:obj.name,
      icon:obj.avatars.medium,
      rote:rote,
      actorID:obj.id,
    };
  }

  /*创建演人数据数组*/
  _createActorArray(json) {
    let actors = [];
    if (json.directors != undefined) {
      for (let obj of json.directors) {
        actors.push(this._createActor(obj,'导演'));
      }
    }
    if (json.writers != undefined) {
      for (let obj of Array.from(json.writers)) {
        actors.push(this._createActor(obj,'编剧'));
      }
    }
    if (json.casts != undefined) {
      for (let obj of Array.from(json.casts)) {
        actors.push(this._createActor(obj,'主演'));
      }
    }
    return actors;
  }


	_renderBar() {
    const barStyle1 = {backgroundColor:'rgba(0,0,0,0)',height:44,alignItems:'flex-end',marginBottom:10,flexDirection:'row'};
    const barStyle2 = {fontSize:17,color:'white',marginLeft:10,marginBottom:2};
    let {movie} = this.state;

    let title = '';
    if (movie != undefined) {
      title = movie.title;
    }

    let backIcon = <MaterialIcons name="keyboard-backspace" size={30} color="#ffffff"/>;
    let backBtnConfig = {
      component: GGButton.buildBackButton(() => {
        dismissKeyboard()
        this.props.navigator.pop()
      }),
    };

		return (
			<View style={styles.bar}>
        <View style={barStyle1}>
          {backBtnConfig.component}
          <Text style={barStyle2}>{title}</Text>
        </View>
      </View>
		);
	}

	_renderRow(rowData,sectionID,rowID) {
    const style1 = {flex:1,backgroundColor:'rgba(0,0,0,0)',justifyContent:'flex-end',alignItems:'center'};
    const role = {marginBottom:5,color:'white',fontSize:11};
    const style3 = {height:25,alignItems:'center',justifyContent:'center'};


    let {actorBG,backgroundColor,movieActorTextColor} = this.state;
    let style = [{flex:1,backgroundColor:actorBG,borderRadius:5}];
    let nameStyle = {fontSize:11,color:movieActorTextColor}
    let image =  {position:'absolute',flex:1,backgroundColor:backgroundColor,left:0,right:0,bottom:0,top:0};
    if (rowID == 0) {
      style[1] = {marginLeft: 2.5};
    }

		return (
      <TouchableOpacity style={{flex:0}} onPress={()=>{
        this.props.navigator.push({
          component : ActorPage,
          params : {
            actorId : rowData.actorID
          }
        })
      }}>
        <View style={[styles.actor,{backgroundColor : backgroundColor}]}>
          <View style={style}>
            <View style={style1} >
              <View style={image}>
                <Image source={{uri: rowData.icon}} style={{flex:1,borderRadius:5}}/>
              </View>
              <Text style={role}>{rowData.rote}</Text>
            </View>
            <View style={style3}>
              <Text style={nameStyle}>{rowData.name}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
		);
	}

  _renderBornMessage(){
    const textBody = {padding:0}
    const text = {fontSize:15,marginVertical:5}
    const body = {borderTopWidth:0.5,borderBottomWidth:0.5,marginHorizontal:10,justifyContent:'space-around'}

    let {movie,movieActorLinecolor,movieActorTitleColor} = this.state;
    let textStyle = [text,{color:movieActorTitleColor}];
    let [time,area] = ['',''] ;


    if (movie != undefined && (movie.countries != undefined)) {
      area = movie.countries[0];
    }
    if (movie && movie.pubdate) {
      time = movie.pubdate
    }

    return (
      <View style={[body,{borderColor : movieActorLinecolor}]}>
        <Text style={textStyle}>{`上映时间:  ${time}`}</Text>
        <Text style={textStyle}>{`国家/地区: ${area}`}</Text>
      </View>
    );
  }

	_renderActors() {
    let {backgroundColor} = this.state.backgroundColor
		return (
      <View style={{height : 145}}>
        <ListView
          horizontal={true}
          style={{flex : 1,backgroundColor:backgroundColor,}}
          showsHorizontalScrollIndicator={false}
          dataSource={this.state.dataSeource}
          renderRow={this._renderRow.bind(this)}
        />
      </View>
		);
	}

  _renderLoading(){
    let {barStyle,darkTextColor,backgroundColor,titlebarBackgroundClolor} = this.state
    return (
      <View style={[styles.content ,{backgroundColor : backgroundColor}]}>
        <TitleBar navigator={this.props.navigator} style={{backgroundColor : titlebarBackgroundClolor}}/>
        <LoadingWidget {...this.props}/>
      </View>
    );
  }

  _renderContent(movie){

    let {barStyle,darkTextColor,backgroundColor,titlebarBackgroundClolor,movieActorTitleColor,movieActorTextColor} = this.state
    let [summary,title] = ['',''];
    if (movie != undefined && (movie.summary != undefined)) {
      summary = movie.summary;
    }
    if (movie && movie.title) {
      title = movie.title;
    }

    return(
      <View style={[styles.content ,{backgroundColor : backgroundColor}]}>
        <TitleBar navigator={this.props.navigator} title={`${title}`} style={{backgroundColor : titlebarBackgroundClolor}}/>

        {this._renderActors()}
        {this._renderBornMessage()}

        <Text style={[styles.info,{color : movieActorTitleColor}]}>
          剧情简介
        </Text>
        <ScrollView style={{flex:1,marginTop:0,paddingHorizontal:10,marginBottom:10}}>
          <Text style={{lineHeight:20,color:movieActorTextColor}}>
            {`  ${summary}`}
          </Text>
        </ScrollView>
      </View>
    );
  }

	render(){
    StatusBar.setBarStyle('light-content',false)

    let {movie,loading} = this.state;
    if (loading) {
      return(this._renderLoading());
    } else {
      return(this._renderContent(movie));
    }
	}
}

const styles = StyleSheet.create({
	content : {
		flex : 1,
    backgroundColor : 'white',
	},
	bar : {
		height : 64 ,
		backgroundColor: GlobalTintColor,
    justifyContent : 'flex-end'
	},
	actor : {
		height : 130,
		width : 100,
		backgroundColor : 'white',
    marginTop: 5,
    marginBottom : 10,
    paddingHorizontal : 2.5,
	},
  info : {
    fontWeight:'bold',
    fontSize:17,
    color:'#363636',
    marginLeft:10,
    marginVertical:10
  }
});


















//
