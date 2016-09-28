/**
 * Created by Ron on 11/5/2016.
 */

import Symbol from 'es6-symbol'

const ActionTypes = {
  //THEME
  CHANGE_THEME_TYPE: 'CHANGE_THEME_TYPE',
  ThemeType : {
    Normal:'Normal',
    Night: 'Night',
  },
  CHANGE_UNREAD_STATE: 'CHANGE_UNREAD_STATE',
};

module.exports = ActionTypes;