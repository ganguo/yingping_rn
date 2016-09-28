/**
 * Created by Ron on 13/6/2016.
 */

"use strict";
import {fetchAppStateBy,storeAppStateWith} from './../storage/AppStateStorage'

import {
  CHANGE_THEME_TYPE,
  ThemeType,
} from '../constrants/ActionTypes';


function updateTheme(state = { _theme : initialTheme() }, action) {
  switch (action.type) {
    case CHANGE_THEME_TYPE:{
      if (action.theme){
        storeTheme(action.theme)
      }
      return Object.assign({},state,{
        _theme: action.theme?action.theme:ThemeType.Night,
      })
    }
    default:
      return state
  }
}

function initialTheme(){
  let theme = fetchAppStateBy('theme')
  if (!theme) return ThemeType.Normal
  return theme
}

function storeTheme(type){
  var value = 'Normal'
  switch (type){
    case ThemeType.Night:{
      value = 'Night'
      break;
    }
  }
  storeAppStateWith(value,'theme');
}

module.exports = {updateTheme, initialTheme};
