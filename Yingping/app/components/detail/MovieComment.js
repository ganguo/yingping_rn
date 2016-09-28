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
} from 'react-native';

import React, {PropTypes,Component} from 'react'
import CommonModules,{
  RefreshLoadMoreList,
  LoadingWidget,
  fetchMovieComment,
  ThemeStyle
} from '../../utils/CommonModules'
import StarRatingBar from '../widget/StarRatingBar'
import CommentCell from './cell/CommentCell';

var id = 0;
var start = 0;
var total = 0;
var nextStart = 0;
var data;

class MovieComment extends Component {
  constructor(props) {
      super(props);
      this.state = {
        jsonData: null,
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        isLoad: false,
        finishLoadMore:false,
        refreshing: false,
      };
      this.renderRow = this.renderRow.bind(this);
      this.refresh = this.refresh.bind(this);
      this.loadMore = this.loadMore.bind(this);
  }

  //组件挂载的时候调用
  componentDidMount(){
    this.refresh();
  }

  /**执行refresh 的监听**/
  refresh(){
    this.setState({
      refreshing:true,
    });

    this.start = 0;
    this.id = this.props.id;
    fetchMovieComment(this.id,this.start,(json,error) => {
      if(error){
        console.log(error)
        this.setState({
          refreshing: false,
        });
      }else {
        this.data = json.comments;
        this.setState({
          jsonData:json,
          dataSource: this.state.dataSource.cloneWithRows(json['comments']),
          isLoad: true,
          refreshing: false,
          finishLoadMore: false,
        });
      }
    });

  }

  /**执行loadMore 的监听**/
  loadMore() {
    if (this.start >= this.total){
        this.setState({
          finishLoadMore:true,
        });
    }else{
      this.start = this.start+20;
      fetchMovieComment(this.id,this.start,(json,error) => {
        if(error){
          console.log(error)
        }else {
          this.data = this.data.concat(json.comments);
          this.setState({
            jsonData:json,
            dataSource: this.state.dataSource.cloneWithRows(this.data),
          });
        }
      })
    }
  }

  /**listview item**/
  renderRow(rowData){
    return (
    <CommentCell {...this.props} comments={rowData}/>
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
    return (
      <RefreshLoadMoreList
        contentContainerStyle={[styles.list,{backgroundColor:backgroundColor}]}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this.renderRow(rowData)}
        onScroll={this.props.onScroll}
        needRefresh={true}
        refreshing={this.state.refreshing}
        refreshFun={this.refresh}
        needLoadMore={true}
        finishLoadMore={this.state.finishLoadMore}
        loadMoreFun={this.loadMore}/>
      );
    }
  }

var styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
    backgroundColor:'#f0f0f0',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
});
//导出场景，供外部require
export default MovieComment;
