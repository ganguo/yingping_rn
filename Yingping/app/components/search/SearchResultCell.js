/**
 * Created by Ron on 26/5/2016.
 */
"use strict";
import ReactNative, {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';

import React, { Component , PropTypes } from 'react';
import CommonModules,{
  ThemeStyle,
  GlobalStyle,
  screenWidth,
  DefaultMarginValue,
  DefaultCornerRadius,
  DefaultRateScoresTextColor,
  DefaultTitleTextColor,
  DefaultRateScoresTextFontSize,
  DefaultMoviePosterRatio
} from '../../utils/CommonModules'

class SearchResultCell extends Component {
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

  // 自定义方法
  handle() {

  }

  // 渲染
  render() {

    let {movie,_theme} = this.props

    const cellBackgroundColor = ThemeStyle[_theme].color.cellBackground
    const titleColor = ThemeStyle[_theme].color.defaultText
    const descriptionColor = ThemeStyle[_theme].color.defaultDescText
    var postUrl = movie.images.medium

    var year = movie.year

    var yearString = year ? '上映年份:' + year : ''

    return (
      <TouchableWithoutFeedback onPress={this.props.handler}>
        <View style={[styles.container,{backgroundColor:cellBackgroundColor}]}>
          <View style={styles.textImageContainer}>
            <Image source={{uri: postUrl}}
                   style={[GlobalStyle.DefaultMovieListCellPost,styles.imageContainer]}/>
            <View style={styles.textContainer}>
              <View style={styles.titleContainer}>
                <Text style={[styles.title,{color:titleColor}]} numberOfLines={1}>{movie.title}</Text>
                <Text style={styles.rateText}>{movie.rating.average}</Text>
              </View>
              <Text style={[styles.year,{color:descriptionColor}]}>{yearString}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );

  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(255,255,255)',
    marginHorizontal: 0,
    marginTop: DefaultMarginValue,
    height: 106,
    width: screenWidth,
  },
  textImageContainer: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
  },
  imageContainer: {
    width: 106 * DefaultMoviePosterRatio,
    height: 106,
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
  year: {
    fontSize: 13,
    color: DefaultTitleTextColor,
    marginLeft: DefaultMarginValue,
    marginBottom: 10,
  },
});

export default SearchResultCell;