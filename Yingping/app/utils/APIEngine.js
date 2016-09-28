/**
 * Created by Ron on 18/5/2016.
 */

import {
  API_KEY,
  API_ROOT,
  API_IN_THEATERS,
  API_TOP_250,
  API_US_BOX,
  API_SEARCH_BY_KEYWORDS,
  API_MOVIE_INFO,
  API_MOVIE_PHOTO,
  API_MOVIE_CELEBRITY } from '../constrants/Config'

import request from 'superagent-bluebird-promise'

function fetchMovieList(relatieURL,fetchCallback){

  var url = API_ROOT + relatieURL

  url = encodeURI(url)

  console.log(url)

  return request.get(url)
    .then(res => {
      fetchCallback(res.body,null)
    },error =>{
      fetchCallback(null,error)
    })

}

export function fetchInTheaters(fetchCallback){

  return fetchMovieList(API_IN_THEATERS,fetchCallback)

}

export function fetchTop250(fetchCallback){

  return fetchMovieList(API_TOP_250,fetchCallback)

}

export function fetchUsBox(fetchCallback){

  return fetchMovieList(API_US_BOX,(json,error) => {
    if(error){
      fetchCallback(null,error)
    }else {

      var results = []

      //console.log(json)

      json['subjects'].forEach(function (item, index, array) {
        results.push(item['subject'])
      });

      fetchCallback(results,null)
    }
  })
}

export function fetchSearchWithKeyword(text,fetchCallback){

  var url = API_ROOT + API_SEARCH_BY_KEYWORDS + text


  url = encodeURI(url)

  //console.log(url)

  return request.get(url)
    .then(res => {
      fetchCallback(res.body,null)
    },error =>{
      fetchCallback(null,error)
    })

}


/**电影详情**/
export function fetchMovieInfo(movieId,fetchCallback){
  let api = `${API_MOVIE_INFO+movieId}?apikey=${API_KEY}`
  return fetchMovieList(api,fetchCallback)
}

/**剧照**/
export function fetchMoviePic(movieId,fetchCallback){
  let api = `${API_MOVIE_PHOTO + movieId}/photos?apikey=${API_KEY}&start=0&count=2000`
  return fetchMovieList(api,fetchCallback)
}

/**影评**/
export function fetchMovieReview(movieId,start,fetchCallback){
  return fetchMovieList(API_MOVIE_INFO+movieId+'/reviews?apikey='+API_KEY+'&start='+start+'&count=20',fetchCallback)
}

/**短评**/
export function fetchMovieComment(movieId,start,fetchCallback){
  return fetchMovieList(API_MOVIE_INFO+movieId+'/comments?apikey='+API_KEY+'&start='+start+'&count=20',fetchCallback)
}

export function fetchCelebrityInfo(celebrityId,fetchCallback) {
  let api = `${API_MOVIE_CELEBRITY+celebrityId}?apikey=${API_KEY}`
  return fetchMovieList(api,fetchCallback)
}

export function fetchCelebrityMovies(celebrityId,fetchCallback) {
  let api = `${API_MOVIE_CELEBRITY+celebrityId}/works?apikey=${API_KEY}`
  return fetchMovieList(api,fetchCallback)
}

export function fetchSourceFromLink(fullUrl,fetchCallback){
  return request.get(fullUrl)
    .then(res => {
      fetchCallback(res.text,null)
    },error =>{
      fetchCallback(null,error)
    })
}