/**
 * Created by Ron on 22/4/2016.
 */
"use strict";
import Realm from 'realm'
class ReadRecord {
}
ReadRecord.schema = {
  name: 'ReadRecord',
  properties: {
    cachekey: 'string',
    read: 'bool'
  }
};
const realm = new Realm({path: 'ReadRecord.realm', schema: [ReadRecord]});

function _getRecordBy(key){
  let records = realm.objects('ReadRecord')
  let filteredString = 'cachekey = "' + key + '"'
  let filterRecords = []
  if (records.length > 0) filterRecords = records.filtered(filteredString)
  let targetRecord = filterRecords[0]
  return targetRecord
}

function isReadBy(movieid:String, reviewid:String) {
  let key = _cachekeyBy(movieid, reviewid);
  if (key) {
    let targetRecord = _getRecordBy(key)
    if (targetRecord) {
      return targetRecord.read;
    } else {
      return false;
    }
  } else {
    return false
  }
}

function markReadedBy(movieid:String, reviewid:String) {
  let key = _cachekeyBy(movieid, reviewid)
  if (key) {
    let targetRecord = _getRecordBy(key)
    if (targetRecord) {
      realm.write(() => {
        targetRecord.read = true;
      });
    } else {
      realm.write(() => {
        realm.create('ReadRecord', {cachekey: key, read: true});
      });
    }
  }
}

function _cachekeyBy(movieid:String, reviewid:String) {
  if (movieid && reviewid) {
    return ('readrecordCacheKey-' + movieid + '-' + reviewid);
  }
  return null;
}

module.exports = {isReadBy, markReadedBy, realm}
