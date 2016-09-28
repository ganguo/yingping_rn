"use strict";

import React, {
  Dimensions,
  Platform,
} from 'react-native';




module.exports = {
  screenWidth: Dimensions.get('window').width,
  screenHeight: Dimensions.get('window').height,
  statusBarHeight: (Platform.OS === 'ios') ? 20 : 0,
  statusHeight: (Platform.OS === 'android' && Platform.Version >= '21') ? 24 : 0,
  searchBarMarginTop: (Platform.OS === 'android') ? 32 : 0,

  RefreshLayoutConsts: (Platform.OS === 'android') ? require('UIManager').AndroidSwipeRefreshLayout.Constants : {SIZE: {}},

  DrawLeftMenuPercentage: 0.6,
  DrawLeftMenuPostRatio: 5/3.0,
  DefaultMovieCollectionCellMargin: 40,
  DefaultMovieListCellRatio: 0.4416,
  DefaultMovieCollectionCellRatio: 1.858,
  DefaultMovieCollectionCellPosterPercentage: 0.744,
  DefaultMoviePosterRatio: 0.7134,
  DefaultCornerRadius: 4,
  DefaultMarginValue: 7.5,

  DefaultTitleTextColor: 'rgb(47,47,47)',
  DefaultTitleTextFontSize: 14,
  DefaultRateScoresTextColor: 'rgb(255,88,62)',
  DefaultRateScoresTextFontSize: 12,
  GlobalTintColor: 'rgb(42,100,255)'
}
