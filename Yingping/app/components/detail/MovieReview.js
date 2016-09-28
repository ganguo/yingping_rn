"use strict";
import RN, {
  StyleSheet,
  Text,
  View,
  Platform,
  Navigator,
  Image,
  BackAndroid,
  TouchableNativeFeedback,
  TouchableOpacity,
  ListView,
  ProgressBarAndroid,
  RefreshControl,
} from 'react-native';

import React, {PropTypes,Component} from 'react'
import CommonModules,{
  LoadingWidget,
  ThemeStyle,
  fetchMovieReview,
} from '../../utils/CommonModules'
import {RefreshLayoutConsts} from '../../constrants/global-constants'
import StarRatingBar from '../widget/StarRatingBar'
import ReviewCell from './cell/ReviewCell';
import ReviewDetail from './MovieReviewDetail'
import {realm , isReadBy} from './../../storage/ReadRecordManager'


var id = 0;
var start = 0;
var total = 0;
var nextStart = 0;
var data;

class MovieReview extends Component {

  constructor(props) {
      super(props);
      this.state = {
        jsonData: null,
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        isLoad: false,
        isRefresh :false,
        finishLoadMore:false,
      };
      this.renderRow = this.renderRow.bind(this);
      this.loadMore = this.loadMore.bind(this);
      this.refresh = this.refresh.bind(this);
      this.randomRead = this.randomRead.bind(this);
  }

  //组件挂载的时候调用
  componentDidMount(){
    console.log('componentDidMount')
    this.refresh();
  }

  componentWillUnMount() {
    console.log('componentWillUnMount')
  }

  refresh() {
    this.setState({
      isRefresh :true,
    });
    this.start = 0;
    this.id = this.props.id;
    fetchMovieReview(this.id,this.start,(json,error) => {
      if(error){
        console.log(error)
        this.setState({
          isRefresh :false,
        });
      }else {
        this.data = this.makeDataFromReviesJSON(json.reviews)
        let isFinishLoadMore=false;
        if(json.total<20){
          isFinishLoadMore =true;
        }
        this.setState({
          jsonData:this.data,
          dataSource: this.state.dataSource.cloneWithRows(this.data),
          isLoad: true,
          isRefresh :false,
          finishLoadMore: isFinishLoadMore,
        });
      }
    })
  }

  loadMore() {

      this.start = this.start+20;
      fetchMovieReview(this.id,this.start,(json,error) => {
        if(error){
          console.log("error: wahaha: "+error)
        }else {
          this.data = this.data.concat(this.makeDataFromReviesJSON(json.reviews));
          this.setState({
            jsonData:json,
            dataSource: this.state.dataSource.cloneWithRows(this.data),
            isLoad: true,
          });
        }
      })
  }

  markReviewReadWithIndex(index){
    let targetReview = this.data[index]
    if (targetReview.isRead === false){
      targetReview.isRead = true
      var newData = JSON.parse(JSON.stringify(this.data));
      this.data = newData
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.data)
      })
    }
  }

  makeDataFromReviesJSON(reviewsJSON){
    let reviewsWithReadInfo = reviewsJSON.map((review)=>{
      let subjectId = review.subject_id
      let reviewsId = review.id
      let isRead = false
      if (subjectId && reviewsId){
        isRead = isReadBy(subjectId,reviewsId)
      }
      return Object.assign(review,{
        isRead : isRead,
      })
    })
    return reviewsWithReadInfo
  }

  //随机读取某个长评
  randomRead() {
    // console.log("随机读取某个长评");

    if (!this.state.dataSource || this.state.dataSource.getRowCount() <= 0) {
      // 数据还没 loading 结束, 或没有数据
      console.log("press dismiss")
      return;
    }

    this.props.navigator.push({
      component: ReviewDetail,
      params : {
        reviews: this.getRandomReviewItem(),
        movieTitle : this.props.movieTitle,
      },
    })
  }

  // 随机返回reviews item
  getRandomReviewItem() {
    return this.state.dataSource.getRowData(0/*section index*/, this.randomNumberInRange(0, this.state.dataSource.getRowCount()));
  }

  // 返回一个范围的随机数
  randomNumberInRange(lower, upper) {
    const random = Math.floor(Math.random() * (upper - lower + 1)) + lower;
    console.log("random : " + random)
    return random;
  }

  renderRow(rowData) {
    return (
      <TouchableOpacity onPress={()=>{
        this.props.navigator.push({
          component: ReviewDetail,
          params : {
            reviews: rowData,
            movieTitle : this.props.movieTitle,
            backHandler : ()=>{
               let indexOfReview = this.data.indexOf(rowData)
              //console.log(indexOfReview)
              this.markReviewReadWithIndex(indexOfReview)
            }
          },
        })
      }}>
        <ReviewCell {...this.props} reviews={rowData}/>
      </TouchableOpacity>
    )
  }

  render()  {
    let {_theme} = this.props
    let backgroundColor = ThemeStyle[_theme].color.listBackground
    if (!this.state.isLoad) {
      return (
        <LoadingWidget {...this.props}/>
      );
    }
    this.total = this.state.jsonData.total;
    this.nextStart = this.state.jsonData.next_start;
    //console.log("ce shi :"+this.total+" "+this.nextStart);
    return (
      <ListView contentContainerStyle={[styles.list,{backgroundColor:backgroundColor}]}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this.renderRow(rowData)}
        renderFooter={()=>this.renderFooter()}
        onScroll={this.props.onScroll}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefresh}
            onRefresh={this.refresh}
            tintColor="#12b7f5"
            size={RefreshLayoutConsts.SIZE.DEFAULT}
            title="加载数据中..."
            colors={['#12b7f5']}
            progressBackgroundColor="#ffffff"
          />}
        onEndReached={this.loadMore}
      />
    );
  }

  renderFooter() {
      if(!this.state.finishLoadMore){
        return (
          <View style={styles.appendLoading}>
            <LoadingWidget text="" />
          </View>
        );
      }
  }
}

var styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
    backgroundColor:'transparent',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  appendLoading: {
    flex: 1,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center'
  },
});
//导出场景，供外部require
export default MovieReview;
