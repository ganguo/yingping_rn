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
  MaterialIcons,
  ThemeStyle,
} from '../../../utils/CommonModules'

class CommentCell extends Component {
  constructor(props) {
      super(props);
  }

  render()  {
    let {comments,_theme} = this.props
    let backgroundColor = ThemeStyle[_theme].color.cellBackground
    let titleTextColor = ThemeStyle[_theme].color.movieCommentDarkText
    let usefulCount = comments.useful_count;
    if(usefulCount>1000){
      usefulCount = usefulCount/1000;
      usefulCount=  usefulCount.toFixed(1)+'k';
    }
    return(
      <View style={[styles.container,{backgroundColor:backgroundColor}]}>

        <View style={{flexDirection:'row'}}>
          <Image
            style={styles.avatar}
            source={{uri:comments.author.avatar}}/>
          <View style={{flex:1}}>
            <View style={{flex:1,flexDirection:'row'}}>
              <View style={{flex:1}}>
                <Text style={{fontSize:14,color:titleTextColor}}>{comments.author.name}</Text>
                <Text style={{fontSize:10,color:'#898989',marginTop:3}}>{comments.created_at}</Text>
              </View>
              <View style={styles.actionItem}>
                <MaterialIcons
                  name="favorite"
                  size={9} color={titleTextColor}/>
                <Text style={{marginLeft:5,fontSize:10,color:titleTextColor}}>{usefulCount}有用</Text>
              </View>
            </View>
            <Text style={{fontSize:14,color:titleTextColor,marginTop:5}}>{comments.content}</Text>
          </View>

        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container:{
    width: screenWidth,
    marginTop:8,
    paddingTop:15,
    paddingLeft:7,
    paddingRight:7,
    paddingBottom:15,
    backgroundColor:'white'
  },
  avatar:{
    width:36,
    height:36,
    marginRight:7,
    borderRadius:18,
    borderWidth:1,
    borderColor:'#d7d7d7',
  },
  actionItem: {
    alignItems:'center',
    justifyContent: 'center',
    flexDirection:'row',
  },
});
//导出场景，供外部require
export default CommentCell;
