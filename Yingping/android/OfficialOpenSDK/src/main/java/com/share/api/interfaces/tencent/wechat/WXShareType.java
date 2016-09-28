package com.share.api.interfaces.tencent.wechat;

/**
 * Created by aaron on 6/23/16.
 * 微信分享类型
 * 1.文本
 * 2.图片
 * 3.音乐
 * 4.视频
 * 5.网页
 */

public interface WXShareType<T> {

    T isText();

    T isImage();

    T isMusic();

    T isVideo();

    T isWebPage();

}
