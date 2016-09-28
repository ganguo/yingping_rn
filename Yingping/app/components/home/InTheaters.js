/**
 * Created by Ron on 18/5/2016.
 */

import ReactNative, {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ListView
} from 'react-native';

import React, { Component , PropTypes } from 'react';
import MovieListCell from './cell/MovieListCell'
import MovieDetail from '../MovieDetail'
import CommonModules,{
 ThemeStyle,
 LoadingWidget,
 fetchInTheaters,
} from '../../utils/CommonModules'

class InTheaters extends Component {
  // 默认属性
  static defaultProps = {};

  // 属性类型
  static propTypes = {};

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      json:undefined,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
    this._renderRow = this._renderRow.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.forceRefreshListView()
  }

  forceRefreshListView(){
    if (this.state.json){
      var newArray = JSON.parse(JSON.stringify(this.state.json));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newArray),
        json: newArray,
      })
    }
  }
  componentDidMount() {
    fetchInTheaters((json,error) => {
      if(error){
        console.log(error)
      }else {
        this.setState({
          json: json['subjects'],
          loaded: true,
          dataSource: this.state.dataSource.cloneWithRows(json['subjects'])
        });
      }
    })
  }

  _renderRow(rowData){
    return (
      <MovieListCell {...this.props} movie={rowData} handler={() => {

          this.props.navigator.push({
                  component: MovieDetail,
                    params: {
                        movie: rowData
                    }
          })

      }}/>
    )
  }

  // 渲染
  render() {

    const {_theme} = this.props

    const backgroundColor = ThemeStyle[_theme].color.listBackground

    if (this.state.loaded){

      return (
        <ListView contentContainerStyle={[styles.list,{backgroundColor:backgroundColor}]}
                  dataSource={this.state.dataSource}
                  renderRow={(rowData) => this._renderRow(rowData)}
        />
      );

    }else {
      return (
        <LoadingWidget {...this.props}/>
      )
    }
  }

}

const styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
});

export default InTheaters;