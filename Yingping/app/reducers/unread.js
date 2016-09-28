/**
 * Created by Ron on 4/7/2016.
 */
"use strict";
import {fetchAppStateBy,storeAppStateWith} from './../storage/AppStateStorage'
import {
  CHANGE_UNREAD_STATE,
} from '../constrants/ActionTypes';
function unreadToggle(state = { _unread : initialUnreadState() }, action) {
  switch (action.type) {
    case CHANGE_UNREAD_STATE:{
      if (action.unreadState !== undefined){
        storeUnreadState(action.unreadState)
      }
      return Object.assign({},state,{
        _unread: (action.unreadState!==undefined)?action.unreadState:true
      })
    }
    default:
      return state
  }
}

function initialUnreadState(){
  let unread = fetchAppStateBy('unread')
  if (!unread) return false
  return unread
}

function storeUnreadState(state){
  var value = false
  if (typeof state === 'boolean'){
    value = state
  }
  storeAppStateWith(value,'unread')
}

module.exports = {unreadToggle, initialUnreadState};
