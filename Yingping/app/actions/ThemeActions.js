/**
 * Created by Ron on 15/6/2016.
 */

import { CHANGE_THEME_TYPE , CHANGE_UNREAD_STATE, ThemeType } from '../constrants/ActionTypes'

export function changeToTheme(theme) {
  return {
    type: CHANGE_THEME_TYPE,
    theme
  };
};

export function toggleUnreadSate(boolean){
  return {
    type: CHANGE_UNREAD_STATE,
    unreadState: boolean
  }
}