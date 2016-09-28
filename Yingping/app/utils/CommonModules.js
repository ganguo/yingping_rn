/**
 * Created by Ron on 31/5/2016.
 */

export {
  screenWidth,
  screenHeight,
  statusBarHeight,
  statusHeight,
  searchBarMarginTop,
  DefaultMovieCollectionCellMargin,
  DefaultMovieListCellRatio,
  DefaultMovieCollectionCellRatio,
  DefaultMovieCollectionCellPosterPercentage,
  DefaultMoviePosterRatio,
  DefaultCornerRadius,
  DefaultMarginValue,
  DefaultTitleTextColor,
  DefaultTitleTextFontSize,
  DefaultRateScoresTextColor,
  DefaultRateScoresTextFontSize,
  GlobalTintColor,
  DrawLeftMenuPercentage,
  DrawLeftMenuPostRatio,
} from '../constrants/global-constants';

export {
  fetchInTheaters,
  fetchTop250,
  fetchUsBox,
  fetchSearchWithKeyword,
  fetchMovieInfo,
  fetchMoviePic,
  fetchMovieReview ,
  fetchMovieComment,
  fetchCelebrityInfo,
  fetchCelebrityMovies} from '../utils/APIEngine';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
module.exports.MaterialIcons = MaterialIcons;

import FontAwesome from 'react-native-vector-icons/FontAwesome';
module.exports.FontAwesome = FontAwesome;

import GlobalStyle from '../styles/global-style';
module.exports.GlobalStyle = GlobalStyle;

import LoadingWidget from '../components/widget/LoadingWidget';
module.exports.LoadingWidget = LoadingWidget;

import RefreshLoadMoreList from '../components/widget/RefreshLoadMoreList';
module.exports.RefreshLoadMoreList = RefreshLoadMoreList;

import GGButton from '../vendors/GGButton';
module.exports.GGButton = GGButton;

import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
module.exports.dismissKeyboard = dismissKeyboard;

import HudView from 'react-native-hud-view';
module.exports.HudView = HudView;

import ThemeStyle from '../styles/theme-style';
module.exports.ThemeStyle = ThemeStyle;
