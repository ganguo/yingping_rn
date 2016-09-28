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
} from 'react-native';

import React, {PropTypes,Component} from 'react'
import CommonModules,{
  screenWidth,
  fetchMoviePic,
} from '../../utils/CommonModules'
import StarRatingBar from '../widget/StarRatingBar'
import DetailBar from './DetailBar'

class DetailPic extends Component {
  constructor(props) {
      super(props);
      this.state = {
        json: null,
        isLoad: false,
      };
  }

  //组件挂载的时候调用
  componentDidMount(){
    const movieInfo = this.props.movieInfo;
    const id = this.props.movieInfo.id;
    fetchMoviePic(id,(json,error) => {
      if(error){
        console.log(error)
      }else {
        this.setState({
          json: json,
          isLoad: true,
        });
      }
    })
  }

  render()  {
    const movieInfo = this.props.movieInfo;
    let ratingMax = movieInfo.rating.max
    let ratingAverage = movieInfo.rating.average
    let ratingForMaxFiveStar = ratingAverage/ratingMax * 5
    if (!this.state.json) {
      return (
        <Image
          style={styles.movieStills}
          source={{uri:'http://ganguo.io/images/big-logo.png'}}>
          <DetailBar navigator ={this.props.navigator}/>
        </Image>
      );
    }
    let moviePic = this.state.json;
    let picTotal= moviePic.total;
    if(picTotal>=50){
      picTotal = 50
    }
    return (
        <Image
          style={styles.movieStills}
          source={{uri: movieInfo.images.large}}>
          <DetailBar navigator ={this.props.navigator}/>
          <View style={{flex:1}}></View>
          <View style={{backgroundColor:'rgba(0,0,0,0.16)'}}>
            <Text style={{color:'white',marginLeft:6,fontSize:20,fontWeight: 'bold'}}>{movieInfo.title}</Text>
            <View style={{flexDirection:'row'}}>
              <StarRatingBar style={styles.starRatingbar}
                userInteractionEnabled={false}
                starCount={ratingForMaxFiveStar}
                defineStarColor='white'/>
              <Text style={{color:'white',marginLeft:6,fontSize:20}}>{ratingAverage}</Text>
            </View>
            <Text style={{color:'white',marginLeft:6,marginBottom:6}}>{picTotal}张剧照</Text>
          </View>
        </Image>
      );
    }
  }

var styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#ffccdd',
  },
  actionItem: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8,
  },
  movieStills: {
    width:screenWidth,
    height:screenWidth*0.59,
    backgroundColor:'grey',
  },
  starRatingbar:{
    marginLeft: 6,
    alignItems: 'center',
  },
});
//导出场景，供外部require
export default DetailPic;
