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
  TouchableOpacity
} from 'react-native';

import CommonModules,{
  ThemeStyle,
  DefaultMarginValue,
  GlobalStyle,
  DefaultTitleTextColor,
  DefaultCornerRadius,
  DefaultRateScoresTextColor
} from '../../../utils/CommonModules'
import React, { Component , PropTypes } from 'react';
import StarRatingBar from '../../widget/StarRatingBar'

class MovieListCell extends Component {
  // 默认属性
  static defaultProps = {};

  // 属性类型
  static propTypes = {
    handler: PropTypes.func,
  };

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  // 渲染
  render() {

    let {movie , _theme } = this.props

    var postUrl = movie.images.large

    var ratingMax = movie.rating.max
    var ratingAverage = movie.rating.average

    var ratingForMaxFiveStar = ratingAverage / ratingMax * 5

    var genresString = movie.genres.join('/')
    var names = movie.casts.map(function (dic) {
      return dic['name']
    })
    var castsListString = names.join('/')

    const titleColor = ThemeStyle[_theme].color.defaultText
    const descriptionColor = ThemeStyle[_theme].color.defaultDescText
    const cellBackgroundColor = ThemeStyle[_theme].color.cellBackground

    return (
      <TouchableOpacity onPress={this.props.handler}>
        <View style={[GlobalStyle.DefaultMovieListCell,styles.container,{backgroundColor:cellBackgroundColor}]}>
          <View style={styles.textImageContainer}>
            <Image source={{uri: postUrl}}
                   style={[GlobalStyle.DefaultMovieListCellPost,styles.imageContainer]}/>
            <View style={styles.textContainer}>
              <View style={styles.titleContainer}>
                <Text style={[styles.title,{color:titleColor}]} numberOfLines={1}>{movie.title}</Text>
                <Text style={styles.rateText}>{movie.rating.average}</Text>
              </View>
              <StarRatingBar style={styles.starRatingbar} userInteractionEnabled={false}
                             starCount={ratingForMaxFiveStar}/>
              <View style={styles.genresContainer}>
                <Text style={[styles.genres,{color:descriptionColor}]}>类型:{genresString}</Text>
                <Text style={[styles.genres,{color:descriptionColor}]}>主演:{castsListString}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );

  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(255,255,255)',
    marginHorizontal: 0,
    marginTop: DefaultMarginValue,
  },
  textImageContainer: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
  },
  imageContainer: {
    marginLeft: DefaultMarginValue,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  titleContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    color: DefaultTitleTextColor,
    marginLeft: DefaultMarginValue,
  },
  rateText: {
    fontSize: 17,
    color: DefaultRateScoresTextColor,
    marginRight: DefaultMarginValue,
  },
  genres: {
    fontSize: 15,
    color: DefaultTitleTextColor,
    marginLeft: DefaultMarginValue,
    marginBottom: 10,
  },
  genresContainer: {
    flexDirection: 'column',
  },
  starRatingbar: {
    marginLeft: DefaultMarginValue,
  },
});

export default MovieListCell;