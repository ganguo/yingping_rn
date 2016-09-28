/**
 * Created by Ron on 23/5/2016.
 */

"use strict";
import ReactNative, {
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

import StarRating from 'react-native-star-rating'
import React, { Component , PropTypes } from 'react';

class StarRatingBar extends Component {
  // 默认属性
  static defaultProps = {
    userInteractionEnabled: true,
    starCount: 0,
    maxStars: 5,
    starSize: 15,
  };

  // 属性类型
  static propTypes = {
    userInteractionEnabled: PropTypes.bool,
    starCount: PropTypes.number,
    maxStars: PropTypes.number,
    starSize: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      starCount: props.starCount,
      userInteractionEnabled: props.userInteractionEnabled,
    };
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    })
  }

  render() {
    let defineStarColor ='red';
    if (this.props.defineStarColor) {
        defineStarColor = this.props.defineStarColor;
    }
    return (
      <StarRating
        style={[styles.container,this.props.style]}
        disabled={!this.state.userInteractionEnabled}
        emptyStar={'ios-star-outline'}
        fullStar={'ios-star'}
        halfStar={'ios-star-half'}
        iconSet={'Ionicons'}
        maxStars={this.props.maxStars}
        starSize={this.props.starSize}
        rating={this.state.starCount}
        selectedStar={(rating) => this.onStarRatingPress(rating)}
        starColor={defineStarColor}
      />
    );
  }

}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  }
})

export default StarRatingBar;
