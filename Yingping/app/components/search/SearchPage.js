/**
 * Created by Ron on 24/5/2016.
 */
"use strict";
import ReactNative, {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ListView,
  Image,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';

import React, { Component , PropTypes } from 'react';
import SearchBar from './SearchBar'
import SearchEmptyPage from './SearchEmptyPage'
import SearchResultCell from './SearchResultCell'
import MovieDetail from './../MovieDetail'
import CommonModules,{
  ThemeStyle,
  GlobalStyle,
  GGButton,
  fetchSearchWithKeyword,
  LoadingWidget,
  MaterialIcons,
  dismissKeyboard
} from '../../utils/CommonModules'

import {
  MKTextField,
  MKColor,
  mdl,
} from 'react-native-material-kit';

class SearchPage extends Component {
  // 默认属性
  static defaultProps = {};

  // 属性类型
  static propTypes = {};

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => (row1 != row2),
      }),
      loading: false,
      searchRequest: undefined
    };
    this.renderRow = this.renderRow.bind(this)
  }

  componentWillUnMount(){
    StatusBar.setBarStyle('light-content',false)
    console.log('----');
  }

  searchTextDidChange(text) {
    console.log(text)
    if (this.state.searchRequest) this.state.searchRequest.cancel()
    var promise = fetchSearchWithKeyword(text, (json, error) => {
      if (json) {
        console.log(this)
        console.log(json['subjects'])
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(json['subjects']),
          loading: false,
        });
      }
    })
    this.setState({
      loading: true,
      searchRequest: promise,
    })
  }

  renderRow(rowData) {

    return (
      <SearchResultCell {...this.props} movie={rowData} handler={() => {
        this.props.navigator.push({
          component: MovieDetail,
                    params: {
                        movie: rowData
                    }
          })

      }}/>
    )
  }

  renderListElement() {

    const {_theme} = this.props
    const listBackground = ThemeStyle[_theme].color.listBackground

    return (
      <ListView contentContainerStyle={[styles.listview,{backgroundColor:listBackground}]}
                dataSource={this.state.dataSource}
                keyboardDismissMode={'on-drag'}
                renderRow={(rowData) => this.renderRow(rowData)}
      />
    )
  }

  // 渲染
  render() {

    var searchIcon = ( <MaterialIcons
      name="search"
      size={30} color="#ffffff"/> );

    const leftButtonConfig = {
      component: GGButton.buildBackButton(() => {
        dismissKeyboard()
        this.props.navigator.pop()
      }),
    };

    const rightButtonConfig = {
      component: GGButton.buildRightButtonWithIcon(searchIcon, () => {
        console.log(this._searchbar)

        this.searchTextDidChange(this._searchbar.text());

      }),
    };

    let {_theme} = this.props
    let listBackground = ThemeStyle[_theme].color.listBackground
    var contentPage;

    if(this.state.loading){
      contentPage = <LoadingWidget {...this.props}/>
    }else {
      if (this.state.dataSource.getRowCount()>0) {
        contentPage = this.renderListElement()
      } else {
        contentPage = <SearchEmptyPage {...this.props}/>
      }
    }

    StatusBar.setBarStyle('light-content',false)
    return (
      <View style={[GlobalStyle.commonContainer,{backgroundColor:listBackground}]}>
        <SearchBar {...this.props} ref={(ref) => {this._searchbar = ref}} leftItem={leftButtonConfig} rightItem={rightButtonConfig}
                   textChangeHandler={(text) => {this.searchTextDidChange(text)}}/>
        {contentPage}
      </View>
    );

  }

}

const styles = StyleSheet.create({
  nagigation: {
    flexDirection: 'row',
  },
  textfield: {
    height: 40,
    margin: 10,
  },
  emptypageContainer: {
    flex: 1,
    backgroundColor: 'rgb(238,238,238)',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  listview: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});

export default SearchPage;
