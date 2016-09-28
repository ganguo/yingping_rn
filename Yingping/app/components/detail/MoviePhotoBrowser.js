import React, { Component,PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Navigator,
  Alert,
  CameraRoll,
  AlertIOS,
  Platform,
  Animated
} from 'react-native';
import {ShareActionSheet, ShareType }from '../widget/ShareActionSheet';
import PhotoBrowser from './PhotoBrowser/lib/index'
import CommonModules,{
  LoadingWidget,
  ThemeStyle,
  fetchMoviePic,
} from '../../utils/CommonModules'

let timerId;

export default class MoviePhotoBrowser extends React.Component{
	constructor(props){
		super(props);
		this.state = ({
      movieId : props.params.movieId,
			photos : [],
		});
		this._onActionButton = this._onActionButton.bind(this);
	}

  componentDidMount(){
		console.log(this.state.movieId)
    fetchMoviePic(this.state.movieId,(json,error)=>{
      if (error) {
				console.log(error);
      } else {
				let photos = json.photos.map((obj)=>{
					if (obj) {
						return {
							photo: obj.image,
							selected: false,
							userInfo: {
								name: obj.author.name,
								icon: obj.author.avatar,
								time: obj.created_at,
							}
						}
					}
					return undefined
				});
				console.log(photos)
				this.setState({photos:photos});
      }
    });
  }

  componentWillUnmount(){
    clearInterval(timerId);
  }

	_alert(Title,Message,ButtomTitle) {
		return Alert.alert(
			Title,
			Message,
			[
				{text: ButtomTitle, onPress: () =>{}},
			]);
	}

	_onActionButton(media, index) {
		let {caption,photo} = media;
		Alert.alert(
			'保存图片',
			caption,
			[
				{text:'取消', onPress:()=>{}},
				{text:'保存', onPress:()=>{
            CameraRoll.saveImageWithTag(photo).done(
              (data)=>{
                this._alert('提示','成功','确定');
              },(err)=>{
                this._alert('提示','失败','确定');
              }
            );
				}},
			]
		);
	}

	render(){
		return(
			<View style={styles.content}>
				<PhotoBrowser
					onBack={()=>{
						this.props.navigator.pop();
					}}
					mediaList={this.state.photos}
					initialIndex={0}
					displayNavArrows={true}
					displaySelectionButtons={false}
					displayActionButton={true}
					startOnGrid={false}
					enableGrid={true}
					useCircleProgress
					onActionButton={this._onActionButton}/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	content : {
		flex : 1,
	},
	tip : {
		position : 'absolute',
		flex : 1,
		top : 0,
		left : 0,
		bottom : 0,
		right : 0,
		backgroundColor : 'rgba(0,0,0,0.5)',
		alignItems : 'center',
		justifyContent : 'center',
	},
	tipText : {
		backgroundColor : 'rgba(255,255,255,0.9)',
		padding : 10,
		fontSize : 17,
	},
});










//
