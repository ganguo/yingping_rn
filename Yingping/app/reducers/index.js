/**
 * Created by Ron on 11/5/2016.
 */
import { combineReducers } from 'redux';
import {updateTheme} from './themer';
import {unreadToggle} from './unread'
const rootReducer = combineReducers({
  updateTheme,
  unreadToggle
});

export default rootReducer;

