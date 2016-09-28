/**
 * Created by Ron on 18/5/2016.
 */

"use strict";
import ReactNative, {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import CommontModules,{
  ThemeStyle,
  GlobalStyle,
  DefaultMovieCollectionCellMargin,
  DefaultRateScoresTextColor,
  DefaultTitleTextFontSize,
  DefaultTitleTextColor,
  DefaultRateScoresTextFontSize
} from '../../../utils/CommonModules'
import React, { Component , PropTypes } from 'react';
import MovieDetail from '../../MovieDetail'

class MovieCollectionCell extends Component {

  // 默认属性
  static defaultProps = {
    style: {},
  };

  // 属性类型
  static propTypes = {
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    handler: PropTypes.func,
  };

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {}

    var rowID = props.rowID
    const largerMargin = DefaultMovieCollectionCellMargin/4;
    const smallerMargin = DefaultMovieCollectionCellMargin/8;
    let leftMargin , rightMargin = smallerMargin

      //Left Item with Larger LeftMargin and Smaller RightMargin
      //Center Item with both Smaller Margin
      //Right Item with Smaller LeftMargin and Larger RightMargin
      if(rowID%3 == 0){
        leftMargin = largerMargin
        rightMargin = smallerMargin
      }else if((rowID%3) == 1){
        leftMargin = rightMargin = smallerMargin
      }else {
        leftMargin = smallerMargin
        rightMargin = largerMargin
      }

    this.style = {
      marginAttribute: {
        marginLeft: leftMargin,
        marginRight: rightMargin,
        marginTop: largerMargin
      },
    }

  };

  _pressRow() {
    const navigator = this.props.navigator;
           if(navigator) {
               navigator.push({
                   component: MovieDetail,
                   //这里多出了一个 params 其实来自于<Navigator 里的一个方法的参数...
                    params: {
                        movie: this.props.movie
                    }
               });
           }
  }


  // 渲染
  render() {

    let postUrl = this.props.movie.images.large
    const {_theme} = this.props
    const cellBackgroundColor = ThemeStyle[_theme].color.cellBackground
    const titleColor = ThemeStyle[_theme].color.defaultText

    return (
      <TouchableOpacity onPress={this.props.handler} underlayColor='#12b7f5'>
        <View style={[GlobalStyle.DefaultMovieCollectionCell,this.style.marginAttribute,styles.container,{backgroundColor:cellBackgroundColor}]}>
          <Image source={{uri: postUrl}}
            style={GlobalStyle.DefaultMovieCollectionCellPoster} />
          <View style={[styles.textContainer,{backgroundColor:cellBackgroundColor}]}>
            <Text style={[styles.title,{color:titleColor}]} numberOfLines={1}>{this.props.movie.title}</Text>
            <Text style={styles.rate}>{this.props.movie.rating.average}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  container:{
    backgroundColor: 'rgb(255,255,255)',
  },
  textContainer:{
    marginVertical: 10,
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'center',
  },
  title:{
    fontSize: DefaultTitleTextFontSize,
    color: DefaultTitleTextColor,
    textAlign: 'center',
    marginBottom: 2.5,
  },
  rate:{
    fontSize: DefaultRateScoresTextFontSize,
    color: DefaultRateScoresTextColor,
    textAlign: 'center',
    marginTop: 2.5,
  }
});

export default MovieCollectionCell;
