//
//  ShareManager.h
//  Yingping
//
//  Created by Ron on 3/6/2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

typedef NS_ENUM(NSUInteger, SharePlatformType){
  /**
   *  新浪微博
   */
  PlatformTypeSinaWeibo           = 1,
  /**
   *  微信好友
   */
  PlatformTypeSubTypeWechatSession    = 2,
  /**
   *  微信朋友圈
   */
  PlatformTypeSubTypeWechatMonment   = 3,
  /**
   *  QQ好友
   */
  PlatformTypeSubTypeQQFriend         = 4,
};

@interface ShareManager : NSObject<RCTBridgeModule>

@end
