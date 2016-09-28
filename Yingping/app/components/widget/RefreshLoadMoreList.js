import RN, {
  StyleSheet,
  ListView,
  View,
  RefreshControl,
  Platform,
} from 'react-native';
import {RefreshLayoutConsts} from '../../constrants/global-constants'
import React, {PropTypes,Component} from 'react'
import LoadingWidget from './LoadingWidget'

class RefreshLoadMoreList extends Component {

  // 默认属性
  static defaultProps = {
    needRefresh: false,
    needLoadMore: false,
    finishLoadMore: false,
    refreshing: false,
  };

  // 属性类型
  static propTypes = {
    renderRow: PropTypes.func,
    dataSource: PropTypes.object,
    needRefresh: PropTypes.bool,
    refreshing: PropTypes.bool,
    needLoadMore: PropTypes.bool,
    finishLoadMore: PropTypes.bool,
    refreshFun: PropTypes.func,
    loadMoreFun: PropTypes.func,
  };

  constructor(props) {
      super(props);
      this.state = {
        isLoad: false,
        isRefresh :false,
      };
  }

  render()  {
    return (
      <ListView
        contentContainerStyle={styles.list}
        dataSource={this.props.dataSource}
        renderRow={this.props.renderRow}
        onScroll={this.props.onScroll}
        renderFooter={()=>this.renderFooter()}
        onEndReached={this.props.loadMoreFun}
        refreshControl={this.renderRefresh()}
      />
      );
  }

  renderRefresh(){
      return (
        <RefreshControl
          refreshing={this.props.refreshing}
          onRefresh={this.props.refreshFun}
          tintColor="#12b7f5"
          size={RefreshLayoutConsts.SIZE.DEFAULT}
          enabled={this.props.needRefresh}
          title="加载数据中..."
          colors={['#12b7f5']}
          progressBackgroundColor="#ffffff"
        />
      );
  }

  renderFooter() {
      if (this.props.needLoadMore){
        if(!this.props.finishLoadMore){
          return (
            <View style={styles.appendLoading}>
              <LoadingWidget text="" />
            </View>
          );
        }
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
export default RefreshLoadMoreList;
