/**
 * Created by Ron on 11/5/2016.
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RootDrawer from '../components/RootDrawer'
import * as ThemeActions from '../actions/ThemeActions';

function mapStateToProps(state) {
  let { updateTheme , unreadToggle} = state
  return Object.assign({},state,updateTheme,unreadToggle)
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ThemeActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RootDrawer);
