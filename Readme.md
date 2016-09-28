## 影评React Native版本

### 运行环境

* react-native-cli: 0.2.0
* react-native: 0.28.2
* Xcode 7.3+
* Android Studio 2.1+

### 运行步骤

To run your app on iOS:

```
   cd Yingping
   react-native run-ios
```
   or
   Open Yingping/ios/Yingping.xcodeproj in Xcode
   Hit the Run button

To run your app on Android:

   Have an Android emulator running (quickest way to get started), or a device connected

```
   cd Yingping
   react-native run-android
```

### 目录简要说明

* app
	* actions (redux action)
	* components （主要界面以及自定义控件）
	* constrants (常量组)
	* containers (redux 容器)
	* reducers (redux 处理器)
	* resourses  (可以放资源，例如字体)
	* storage (持久化数据，可以是cache或者database)
	* style (目录内的`global-style.js`放公共的样式)


### 注意事项
* 控件可以去[react.parts](https://react.parts/native)或者[js coach](https://js.coach/react-native)找
* 优先选择![](http://res.cloudinary.com/boolron/image/upload/v1461061569/qggigmrimenmivnzzvzm.png)标记的，能同时兼容两个端

### [下载体验](https://github.com/ganguo/yingping_rn/blob/master/Yingping.ipa)
