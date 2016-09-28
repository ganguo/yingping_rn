import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions
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
} from '../../../utils/CommonModules'

export default class TitleBar extends React.Component{
	constructor(props){
		super(props);
		this.state = ({

		});
	}

	render(){
		const barStyle = {height : 64 ,backgroundColor: GlobalTintColor,justifyContent : 'flex-end'}
		const barStyle1 = {backgroundColor:'rgba(0,0,0,0)',height:44,alignItems:'flex-end',marginBottom:10,flexDirection:'row'};
		const barStyle2 = {fontSize:17,color:'white',marginLeft:20};
		const barStyle3 = {height:27,alignItems:'center',justifyContent:'center'}

		let barTitle = '';
		let {title,style} = this.props;
		if (title) {
			barTitle = title;
		}
		let backIcon = <MaterialIcons name="keyboard-backspace" size={30} color="#ffffff"/>;
		let backBtnConfig = {
			component: GGButton.buildBackButton(() => {
				dismissKeyboard()
				this.props.navigator.pop()
			}),
		};

		return (
			<View style={[barStyle,style]}>
				<View style={barStyle1}>
					{backBtnConfig.component}
					<View style={barStyle3}>
						<Text style={barStyle2}>{barTitle}</Text>
					</View>
				</View>
			</View>
		);
	}
}



















//
