/**
 * Created by Ron on 21/4/2016.
 */
'use strict'
import React, {
  StyleSheet,
} from 'react-native';

import {
  screenWidth,
  screenHeight,
  DefaultMovieCollectionCellMargin,
  DefaultMovieCollectionCellRatio,
  DefaultMovieListCellRatio,
  DefaultMovieCollectionCellPosterPercentage,
  DefaultCornerRadius,
  DefaultMoviePosterRatio,
  DefaultTitleTextColor} from '../constrants/global-constants'

const styles = StyleSheet.create({
  fullScreenStyle:{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  commonContainer:{
    flex: 1,
    backgroundColor: 'rgb(240,240,240)',
  },
  loadingplaceholder: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  DefaultMovieListCell:{
    width: screenWidth,
    height: screenWidth * DefaultMovieListCellRatio,
  },
  DefaultMovieListCellPost:{
    width: screenWidth * DefaultMovieListCellRatio * DefaultMoviePosterRatio,
    height: screenWidth * DefaultMovieListCellRatio,
  },
  DefaultMovieCollectionCell:{
    width: (screenWidth - DefaultMovieCollectionCellMargin)/3,
    height: ((screenWidth - DefaultMovieCollectionCellMargin))/3 * DefaultMovieCollectionCellRatio,
    borderRadius: DefaultCornerRadius
  },
  DefaultMovieCollectionCellPoster:{
    width: (screenWidth - DefaultMovieCollectionCellMargin)/3,
    height: (((screenWidth - DefaultMovieCollectionCellMargin))/3
             * DefaultMovieCollectionCellRatio) * DefaultMovieCollectionCellPosterPercentage,
    marginTop: 0,
    borderRadius: DefaultCornerRadius,
  }
})

export default styles