import React, { PropTypes } from 'react';
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { BarContainer, BAR_POSITIONS } from './BarContainer';

const BUTTON_WIDTH = 40;

export default class BottomBar extends React.Component {

  static propTypes = {
    displayed: PropTypes.bool,
    height: PropTypes.number,
    caption: PropTypes.string,
    displayNavArrows: PropTypes.bool,
    displayGridButton: PropTypes.bool,
    displayActionButton: PropTypes.bool,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    onGrid: PropTypes.func,
    onAction: PropTypes.func,
  };

  static defaultProps = {
    displayed: false,
    caption: '',
    displayNavArrows: false,
    displayGridButton: false,
    displayActionButton: false,
    onPrev: () => {},
    onNext: () => {},
    onGrid: () => {},
    onAction: () => {},
  };

  _renderActionSheet() {
    const { displayActionButton, onAction } = this.props;
    if (displayActionButton) {
      return (
        <TouchableOpacity style={[styles.button, { flex: 0 }]} onPress={onAction}>
          <Image
            source={require('../../Assets/download-button.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      );
    }
    return null;
  }

  _renderUserInfo(userInfo){
		return(
			<View style={styles.userInfo}>
				<Image
					style={styles.avatar}
          source={{uri: userInfo.icon}}/>
				<View style={{flex:1}}>
					<Text style={{fontSize:14,color:'#959595'}}>{userInfo.name}</Text>
					<Text style={{fontSize:10,color:'#898989',marginTop:3}}>{userInfo.time}上传</Text>
				</View>
        {this._renderActionSheet()}
			</View>
		);
	}

  render() {
    const { displayed, caption, height ,userInfo} = this.props;

    return (
    <BarContainer
      position={BAR_POSITIONS.BOTTOM}
      displayed={displayed}
      height={height}
      style={styles.container}
    >
      {this._renderUserInfo(userInfo)}
    </BarContainer>
    );
  }
}
//<Text style={styles.caption} numberOfLines={1}>{caption}</Text>
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent : 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  button: {
    alignItems: 'center',
    width: BUTTON_WIDTH,
  },
  buttonImage: {
    marginTop: 8,
    width : 18,
    height : 18,
    resizeMode : 'contain',
  },
  userInfo : {
    borderTopWidth : 0.5,
    borderColor : '#898989',
    flexDirection:'row',
    height: 50,
    paddingHorizontal : 7,
    paddingVertical : 7,
  },
  avatar:{
    width:36,
    height:36,
    marginRight:7,
    borderRadius:18,
    borderWidth:1,
    borderColor:'#d7d7d7',
  },
});
