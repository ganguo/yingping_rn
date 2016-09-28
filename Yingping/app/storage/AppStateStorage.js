/**
 * Created by Ron on 4/7/2016.
 */
"use strict";
import Realm from 'realm'
const initTheme = 'Normal'
const initUnread = false
class AppState {}
AppState.schema = {
  name: 'AppState',
  properties: {
    theme: {type: 'string', default: initTheme},
    unread: {type: 'bool', default: initUnread},
  }
};
const realm = new Realm({path:'AppState.realm',schema: [AppState]});

export function fetchAppStateBy(key){
 if(key){
  let appState = realm.objects('AppState')[0]
   if (appState){
     return appState[key]
   }else {
     let property = AppState.schema.properties[key]
     return property['default'];
   }
 }
  return undefined;
}

export function storeAppStateWith(value,key){
  if((value !== undefined) && key){
    let appState = realm.objects('AppState')[0]
    if (!appState){
      let property = AppState.schema.properties[key]
      if (property){
        var objForCreateRealm = {}
        if (key == 'theme'){
          objForCreateRealm = {key:value,'unread':initUnread}
        }else if(key == 'unread'){
          objForCreateRealm = {key:value,'theme':initTheme}
        }
        realm.write(()=>{
          realm.create('AppState',objForCreateRealm)
        })
      }
    }else {
      realm.write(()=>{
        appState[key] = value
      })
    }
  }
}

module.exports = {fetchAppStateBy,storeAppStateWith};
