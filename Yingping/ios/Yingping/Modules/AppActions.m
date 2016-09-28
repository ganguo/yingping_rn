//
//  AppActions.m
//  Yingping
//
//  Created by Ron on 5/7/2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "AppActions.h"

@implementation AppActions

RCT_EXPORT_METHOD(cleanCacheWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  
  NSArray *myPathList = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
  NSString *mainPath    = [myPathList  objectAtIndex:0];
  
  NSString *bunddleID = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleIdentifier"];
  
  NSLog(@"bunddle ID:%@",bunddleID);
  mainPath = [mainPath stringByAppendingPathComponent:bunddleID];
  mainPath = [mainPath stringByAppendingPathComponent:@"fsCachedData"];
  
  NSFileManager *fileManager = [NSFileManager defaultManager];
  BOOL fileExists = [fileManager fileExistsAtPath:mainPath];
  
  if (fileExists)
  {
    dispatch_async(dispatch_get_global_queue(0, 0), ^{
      BOOL success = [fileManager removeItemAtPath:mainPath error:nil];
      dispatch_async(dispatch_get_main_queue(), ^(void) {
        resolve(@(success));
      });
    });
  }else {
    resolve(@NO);
  }
  
  
}
RCT_EXPORT_MODULE();
@end
