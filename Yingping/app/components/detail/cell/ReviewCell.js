import RN, {
  StyleSheet,
  Text,
  View,
  Platform,
  Navigator,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';

import React, {PropTypes,Component} from 'react'
import CommonModules,{
  screenWidth,
  ThemeStyle,
  GlobalTintColor,
  MaterialIcons,
} from '../../../utils/CommonModules'

class ReviewCell extends Component {
  constructor(props) {
    super(props);
  }

  renderUnreadIcon(hasRead){
    let {_unread} = this.props
    if (_unread === true && hasRead === false){
      return (
        <View style={{position:'absolute',top:18,left:3,margin:3}}>
          <MaterialIcons name="brightness-1" size={8} color='rgb(42,100,255)'/>
        </View>
      )
    }else {
      return null
    }
  }

  render() {
    let {reviews,_theme,_unread} = this.props;
    let subjectId = reviews.subject_id
    let reviewsId = reviews.id
    let hasRead = reviews.isRead
    let backgroundColor = ThemeStyle[_theme].color.cellBackground
    let titleTextColor = ThemeStyle[_theme].color.defaultText
    let descriptionTextColor = ThemeStyle[_theme].color.defaultDescText
    let unreadIcon = this.renderUnreadIcon(hasRead)
    if (_unread === undefined) _unread = false
    if (hasRead === undefined) hasRead = false

    function renderAuthoerAvatar(author){
      if(author){
       return (
         <Image
           style={styles.avatar}
           source={{uri:author.avatar}}/>
       )
      }else{
        return null
      }
    }

    return (
      <View style={[styles.container,{backgroundColor:backgroundColor}]}>
        {unreadIcon}
        <Text style={{fontSize:16,color:titleTextColor,marginLeft: 15*(unreadIcon!==null)}} >{reviews.title}</Text>
        <View style={{marginTop:7, flexDirection:'row'}}>
          {renderAuthoerAvatar(reviews.author)}
          <View style={{flex:1}}>
            <Text style={{fontSize:14,color:'#363636'}}>{reviews.author.name}</Text>
            <Text style={{fontSize:10,color:'#898989',marginTop:3}}>{reviews.updated_at}</Text>
            <Text style={{fontSize:14,color:descriptionTextColor,marginTop:5}}
                  numberOfLines={3}>{reviews.summary}</Text>
            <Text style={{fontSize:12,color:'#12b7f5',marginTop:3, alignSelf:'flex-end'}}>查看全部内容</Text>
          </View>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    width: screenWidth,
    marginTop: 8,
    paddingTop: 15,
    paddingLeft: 7,
    paddingRight: 7,
    paddingBottom: 15,
    backgroundColor: 'white'
  },
  avatar: {
    width: 36,
    height: 36,
    marginRight: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7d7d7',
  },
});
//导出场景，供外部require
export default ReviewCell;
