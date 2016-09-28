import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
	Image,
	ListView,
	TouchableOpacity,
  ScrollView,
} from 'react-native';

import CommonModules,{
  ThemeStyle,
  statusHeight,
  GlobalStyle,
  MaterialIcons,
  LoadingWidget,
	fetchCelebrityInfo,
	fetchCelebrityMovies,
  screenWidth,
  screenHeight,
} from '../../utils/CommonModules'
import TitleBar from './Bar/TitleBar'
import MovieDetail from '../MovieDetail'
export default class ActorPage extends React.Component{
	constructor(props){
		super(props);
		let movies = new ListView.DataSource({
		  rowHasChanged : (oldRowData,newRowData)=>oldRowData!==newRowData,
		});
    let {_theme} = props
		this.state = ({
			movies : movies,
			celebrity : undefined,
			loading : true,
      titlebarBackgroundClolor : ThemeStyle[_theme].color.titlebarBackgroundClolor,
      backgroundColor : ThemeStyle[_theme].color.background,
      actorPageTextColor : ThemeStyle[_theme].color.actorPageTextColor,
      actorPageTitleColor : ThemeStyle[_theme].color.actorPageTitleColor,
      movieActorLinecolor : ThemeStyle[_theme].color.movieActorLinecolor,

		});
	}

	componentDidMount(){
		let fetchId = `${this.props.params.actorId}`
		fetchCelebrityInfo(fetchId,(celebrityJson,error)=>{
			if (error) {
				console.log(error);
			} else {
				fetchCelebrityMovies(fetchId,(movieJson,error)=>{
					if (error) {
						console.log(error);
					} else {
						this.setState({
							celebrity : celebrityJson,
							movies : this.state.movies.cloneWithRows(movieJson.works.filter(x => x.subject != undefined)),
							loading : false,
						});
					}
				})
			}
		});
	}

	renderTop() {
		let {celebrity,actorPageTitleColor,actorPageTextColor,movieActorLinecolor} = this.state
		let worksSet = new Set()
		celebrity.works.map(obj=>obj.roles).map(obj2=>{
			obj2.map(x=>worksSet.add(x))
		})
		let works = Array.from(worksSet).toString()
    let name = [styles.topName,{color:actorPageTitleColor}]
    let topText = [styles.topText,{color : actorPageTextColor}]
		return (
			<View style={[styles.top,{borderColor:movieActorLinecolor}]}>
				<View style={styles.topImageContent}>
					<Image source={{uri:celebrity.avatars.large}} style={styles.topImage} />
				</View>
				<View style={styles.topTextContent}>
					<Text style={name}>{celebrity.name}</Text>
					<Text style={topText}>{`英文名：${celebrity.name_en}`}</Text>
					<Text style={topText}>{`出生年月：${celebrity.birthday}`}</Text>
					<Text style={topText}>{`职业：${works}`}</Text>
					<Text style={topText}>{`住址：${celebrity.born_place}`}</Text>
				</View>
			</View>
		);
	}

	renderMovie(data,sectionID,rowID) {

		let image = data.subject.images.large
		let title = data.subject.title
		let average = data.subject.rating.average
    let {actorPageTextColor} = this.state

		return (
			<TouchableOpacity style={{flex:0}} onPress={()=>this.props.navigator.push({
				component: MovieDetail,
				params: {
					movie: data.subject
				}
			})}>
				<View style={styles.movieContent}>
					<View style={styles.bottomImageContent}>
						<Image source={{uri:image}} style={styles.bottomImage} />
					</View>
					<View style={styles.bottomTextContent}>
						<Text style={[styles.bottomMovieTitle,{color : actorPageTextColor}]}>{title}</Text>
						<Text style={styles.bottomMovieNumber}>{average}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	renderBottom() {
		let {movies,actorPageTitleColor,backgroundColor} = this.state;
		console.log(movies);
		return (
			<View style={[styles.bottom,{backgroundColor:backgroundColor}]}>
				<Text style={[styles.bottomTitle,{color:actorPageTitleColor}]}>影人相关</Text>
				<ListView
					style={[styles.lisView,{backgroundColor : backgroundColor}]}
					dataSource={movies}
					renderRow={this.renderMovie.bind(this)}
					horizontal={true}
          showsHorizontalScrollIndicator={false}
				/>
			</View>
		);
	}

	render(){
		let {loading,celebrity,titlebarBackgroundClolor,backgroundColor} = this.state

		if (loading) {
			return(
				<View style={[styles.content,{backgroundColor:backgroundColor}]}>
					<TitleBar navigator={this.props.navigator} style={{backgroundColor : titlebarBackgroundClolor}}/>
					<LoadingWidget {...this.props}/>
				</View>
			)
		} else {
			return(
				<View style={[styles.content,{backgroundColor:backgroundColor}]}>
					<TitleBar navigator={this.props.navigator} title={celebrity.name}  style={{backgroundColor : titlebarBackgroundClolor}}/>
          <ScrollView style={[styles.content,{backgroundColor:backgroundColor}]} >
            {this.renderTop()}
            {this.renderBottom()}
          </ScrollView>
				</View>
			);
		}
	}
}


const styles = StyleSheet.create({
	content : {
		flex : 1,
		backgroundColor : 'white',
	},
	top : {
		flexDirection : 'row',
		marginHorizontal : 7,
		borderBottomWidth : 0.5,
		borderColor : '#f4f4f4'
	},
	topImageContent : {
		marginTop : 5,
		marginRight : 7,
		marginBottom : 10,
		width : 170,
		height : 240,
	},
	topImage : {
		flex : 1,
		borderRadius : 5,
	},
	topTextContent: {
		flex : 1,
		marginVertical : 5,
	},
	topName : {
		marginVertical : 5,
		fontSize : 18,
		color : '#363636'
	},
	topText : {
		fontSize : 15,
		color : '#363636',
		marginTop : 8,
		lineHeight : 20,
	},
	bottom : {
		flex : 1,
		marginHorizontal : 7,
	},
	bottomTitle : {
		fontSize : 18,
		marginVertical : 10,
	},
	lisView : {
		flex : 1,
	},
	movieContent : {
		marginRight : 5,
		width : 130,
		flex : 1,
	},
	bottomTextContent : {
		alignItems : 'center',
    height:80,
	},
	bottomImageContent : {
		height : 183,
	},
	bottomImage : {
		borderRadius : 2,
		flex : 1,
	},
	bottomMovieTitle : {
		marginTop : 14,
		marginBottom : 7,
		fontSize : 14,
		color : '#363636',
		fontWeight : 'bold'
	},
	bottomMovieNumber : {
		fontSize : 14,
		color : '#ff6347',
	}
});



















//
