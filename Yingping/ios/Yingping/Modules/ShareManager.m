//
//  ShareManager.m
//  Yingping
//
//  Created by Ron on 3/6/2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "ShareManager.h"
#import <GGShareKit.h>

@implementation ShareManager

RCT_EXPORT_METHOD(getShareTypesSupport:(NSString *)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{

   NSDictionary *shareTypes = @{
                               @"weibo" : @([WeiboSDK isWeiboAppInstalled]),
                               @"wechat" : @([WXApi isWXAppInstalled]),
                               @"qq" : @([QQApiInterface isQQInstalled]),
                               };

  resolve(shareTypes);

}

RCT_EXPORT_METHOD(shareContent:(NSDictionary *)contentDic WithType:(NSInteger ) platformType andResolver:(RCTPromiseResolveBlock)resolve andRejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *title = contentDic[@"title"];
  NSString *content = contentDic[@"content"];
  NSString *urlString = contentDic[@"url"];

  SKContent *shareContent = [[SKContent alloc] init];
  shareContent.image = [UIImage imageNamed:@"shareimage"];
  shareContent.title = title;
  shareContent.content = content;
  if (urlString) {
    shareContent.url = [NSURL URLWithString:urlString];
  }

  switch (platformType) {
    case PlatformTypeSubTypeWechatSession:
      shareContent.type = SKPlatformTypeSubTypeWechatSession;
      break;
    case PlatformTypeSubTypeWechatMonment:
      shareContent.type = SKPlatformTypeSubTypeWechatMonment;
      break;
    case PlatformTypeSubTypeQQFriend:
      shareContent.type = SKPlatformTypeSubTypeQQFriend;
      break;
    default:
      shareContent.content = [NSString stringWithFormat:@"#%@#  %@",shareContent.title,shareContent.content];
      shareContent.type = SKPlatformTypeSinaWeibo;
      break;
  }

  dispatch_async(dispatch_get_main_queue(), ^(void) {
    [GGShareKit share:shareContent onStateChanged:^(SKResponseState state) {

      if (state == SKResponseStateSuccess) {
        resolve(nil);
      }else if(state == SKResponseStateFail || state == SKResponseStateCancel){
        reject(@(state).stringValue,nil,nil);
      }

    }];
  });

}

- (NSDictionary *)constantsToExport
{
  return @{ @"Weibo" : @(PlatformTypeSinaWeibo),
            @"Wechat" : @(PlatformTypeSubTypeWechatSession),
            @"Moment" : @(PlatformTypeSubTypeWechatMonment),
            @"QQ" : @(PlatformTypeSubTypeQQFriend)};
}


RCT_EXPORT_MODULE();

@end
