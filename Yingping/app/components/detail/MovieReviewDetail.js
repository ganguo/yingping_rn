"use strict";
import React, { Component , PropTypes} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Animated,
  NativeModules,
  InteractionManager,
  WebView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
//var ShareManager = NativeModules.ShareManager;
import CommonModules,{
  ThemeStyle,
  dismissKeyboard,
  statusBarHeight,
  GlobalTintColor,
  GlobalStyle,
  GGButton,
  screenWidth,
  screenHeight,
  statusHeight,
  MaterialIcons,
} from '../../utils/CommonModules'
import {ShareActionSheet, ShareType }from '../widget/ShareActionSheet'
var createImageContentFromHtmlSourceCode = require('moviereview-reader');
import {markReadedBy} from './../../storage/ReadRecordManager'
import {fetchSourceFromLink} from './../../utils/APIEngine'


const HTML_HEAD = `
<!DOCTYPE html>\n
<html>
  <head>
    <title></title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <style type="text/css">
    div img {
        margin: 10;
        text-align: center;
        width: 100%;
        height: auto;
      }
    #avatar {
      width: 36px;
      height: 36px;
      border-style: solid;
      border-width: 1px;
      border-color: rgb(200,200,200);
      border-radius: 18px;
      -webkit-border-radius: 18px;
      -moz-border-raduis: 18px;
    }
`;

const HTML_DEFAULT_BODY_STYLE = (backgroundColor,textColor) => `
 body {
        margin: 20;
        font: 15px;
        font-family: Sans-serif;
        background:
` + backgroundColor + `;
        color:
` + textColor + `;
}
`

const HTML_DEFAULT_BODY_STYLE_TAIL = `
    </style>
  </head>
  <body>
`

const HTML_ARTICAL_HEADER = (TitleText,AuthorText,DateText,AvatarUrl, TitleColor,AuthorColor,DateColor) => `
<span style="font-size: medium; color: ` + TitleColor + ` "> ` + TitleText + ` </span>
  <br>
  <img style="float:left;margin-top: 8px;" id="avatar" src=" ` + AvatarUrl + `"/>
  <p style="margin-top: 8px; margin-left: 45px;">
    <span  style="color: ` + AuthorColor + `; font-size: 15px ; margin-top: 0"> ` + AuthorText + ` </span> <br>
    <span  style="color: ` + DateColor + `; font-size:11px; margin-bottom: 0"> ` + DateText + `</span>
  </p>
  </p>
`

const HTML_CONTENT_STYLE = (content) => `
  <content style="line-height: 175%"> ` + content + ` </content>
`

const HTML_TAIL = `
  </body>
</html>
`;

export default class MovieReviewDetail extends React.Component {

  constructor(props) {
    super(props);
    let reviews = props.params.reviews
    let subjectId = reviews.subject_id
    let reviewId = reviews.id
    markReadedBy(subjectId,reviewId)
    let initConent = createImageContentFromHtmlSourceCode(undefined,reviews.content)
    fetchSourceFromLink(reviews.alt,(source,error)=>{
      if (source){
        console.log(source,reviews.content);
        this.setState({
          resultContent: createImageContentFromHtmlSourceCode(source,reviews.content)
        })

      }
    });
    this.state = ({
      translateY: new Animated.Value(0),
      scale: new Animated.Value(1),
      showStatusBar: true,
      showUpwardButton: false,
      canShowUpwardButton: true,
      listViewScrollY: 0,
      resultContent: initConent,
      showShareButton: false,
    });
    this._getResultContent = this._getResultContent.bind(this)

    if (Platform.OS === 'ios') {
      /*
      ShareManager.getShareTypesSupport('key').then((allShareTypes) => {
        let types = []
        if (allShareTypes.weibo) {
          types.push(ShareType.Weibo)
        }
        if (allShareTypes.wechat) {
          types.push(ShareType.Wechat, ShareType.Moment)
        }
        if (allShareTypes.qq) {
          types.push(ShareType.QQ)
        }
        if (types.length > 0){
          this.setState({
            showShareButton: true,
          })
        }
      }, ()=> {
      })
      */
    }
  }

  _getResultContent(content) {
    let {_theme} = this.props

    let {reviews} = this.props.params;

    let textColor = ThemeStyle[_theme].color.defaultDescText
    let backgroundColor = ThemeStyle[_theme].color.listBackground
    let darkTextColor = ThemeStyle[_theme].color.defaultText
    let lightTextColor = '#898989'

    return HTML_HEAD + HTML_DEFAULT_BODY_STYLE(backgroundColor,textColor) +
      HTML_DEFAULT_BODY_STYLE_TAIL +
      HTML_ARTICAL_HEADER(reviews.title,
        reviews.author.name,
        reviews.updated_at,
        reviews.author.avatar,
        darkTextColor,
        darkTextColor,
        lightTextColor
      ) +
      HTML_CONTENT_STYLE(content) + HTML_TAIL;
  }

  componentWillUnMount() {
    console.log('componentWillUnMount')
  }

  handelStatusBar(e) {
    let {showStatusBar,listViewScrollY,showUpwardButton,canShowUpwardButton} = this.state;
    let y = e.nativeEvent.contentOffset.y;
    //隐藏StatusBar
    if (showStatusBar == true && y > (listViewScrollY + 50)) {
      this.setState({
        showStatusBar: false,
      });
      InteractionManager.runAfterInteractions(() => {
        Animated.timing(this.state.translateY, {
          toValue: -(0 + 64),
          duration: 250,
        }).start();
      });
    }
    //显示StatusBar
    else if (showStatusBar == false && y < (listViewScrollY - 50)) {
      this.setState({
        showStatusBar: true,
      });
      InteractionManager.runAfterInteractions(() => {
        Animated.timing(this.state.translateY, {
          toValue: 0,
          duration: 250,
        }).start();
      });
    }

    if (canShowUpwardButton == true) {
      if (showUpwardButton == false && y > 200) {
        this.setState({showUpwardButton: true});
      } else if (showUpwardButton == true && y <= 200) {
        this.setState({showUpwardButton: false});
      }
    }
    this.setState({
      listViewScrollY: Math.max(y, 0),
    });
  }

  renderCustomBar() {
    let {movieTitle} = this.props.params;
    let {_theme} = this.props
    let barTintColor = ThemeStyle[_theme].color.navigationBarTint
    let backIcon = <MaterialIcons name="keyboard-backspace" size={30} color="#ffffff"/>;
    let shareIcon = <MaterialIcons name="share" size={25} color="#ffffff"/>;
    let leftBtnConfig = {
      component: GGButton.buildLeftButtonWithIcon(backIcon, () => {
        dismissKeyboard()
        this.props.navigator.pop()
        //var routes = this.props.navigator.state.routeStack;
        //for (var i = routes.length - 1; i >= 0; i--) {
        //  if(routes[i].component.name === "MovieDetail"){
        //    var destinationRoute = this.props.navigator.getCurrentRoutes()[i]
        //    this.props.navigator.popToRoute(destinationRoute);
        //  }
        //}
      }),
    };
    let rightBtnConfig = {
      component: this.state.showShareButton ? GGButton.buildLeftButtonWithIcon(shareIcon, () => {
        dismissKeyboard()
        this._shareActionsheet.showAction();
      }) : null,
    };

    let animatedStyle = {transform: [{translateY: this.state.translateY}]};
    let barStyle = [styles.bar, animatedStyle, {backgroundColor: barTintColor}];
    return (
      <Animated.View style={barStyle}>
        {leftBtnConfig.component}
        <View style={styles.titleContent}>
          <Text style={styles.title}>{movieTitle}</Text>
        </View>
        {rightBtnConfig.component}
      </Animated.View>
    );
  }


  renderContent(reviews) {
    let {_theme} = this.props
    let darkTextColor = ThemeStyle[_theme].color.movieCommentDarkText
    let backgroundColor = ThemeStyle[_theme].color.listBackground
    let htmlContent;
    if (this.state.resultContent) {
      htmlContent = this._getResultContent(this.state.resultContent)
      console.log(this.state.resultContent)
    } else {
      return (<View />)
    }
    return (
    <WebView javaScriptEnabled={true} ref={(ref)=>{this._webview=ref;}} style={[styles.webview,{backgroundColor: backgroundColor}]} source={{html: htmlContent}}
             onLoadStart={()=>{
                   }}
             onNavigationStateChange={(navState)=>{
                   }}
    />
    )
  }


  renderUpwardButton() {
    if (this.state.showUpwardButton == false) {
      return;
    }
    let Icon = <MaterialIcons
      name="arrow-upward"
      size={20}
      color="#ffffff"
      style={{backgroundColor:'rgba(0,0,0,0)'}}
    />;
    let btnStyle = [styles.upwordButton, {transform: [{scale: this.state.scale}]}];
    return (
      <Animated.View style={btnStyle}>
        <TouchableOpacity onPress={()=>{
					this.refs.listView.scrollTo({x: 0, y: 0, animated: true});
					this.setState({
						canShowUpwardButton : false,
						showUpwardButton : false,
					});
					setTimeout(()=>{
						this.setState({canShowUpwardButton : true});
					}, 1000);
				}}>
          {Icon}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  render() {
    StatusBar.setBarStyle('light-content',false)

    let {_theme} = this.props
    let darkTextColor = ThemeStyle[_theme].color.movieCommentDarkText
    let barStyle = ThemeStyle[_theme].statusBar
    let {reviews,movieTitle} = this.props.params;
    let shareTitle = movieTitle
    let shareContent = reviews.title
    let shareUrl = reviews.share_url

    return (

      <View style={styles.content}>
        <ShareActionSheet
          {...this.props}
          shareObject={{title:shareTitle,content:shareContent,url:shareUrl}}
          ref={(ref) => {this._shareActionsheet = ref}}>

          {this.renderContent(reviews)}
          {this.renderCustomBar()}
          {this.renderUpwardButton()}

        </ShareActionSheet>
      </View>

    );

  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
    paddingTop: 0 + 64,
  },
  bar: {
    top: 0,
    left: 0,
    right: 0,
    paddingTop: statusHeight,
    height: 0 + 64,
    backgroundColor: GlobalTintColor,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  titleContent: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
    marginTop: statusBarHeight,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 17,
    color: 'white',
  },
  upwordButton: {
    position: 'absolute',
    width: 30,
    height: 30,
    bottom: 25,
    right: 10,
    backgroundColor: '#ff583e',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webview: {
    backgroundColor: 'transparent',
    width: screenWidth,
    marginTop: 64,
    flex: 1,
  }
});
