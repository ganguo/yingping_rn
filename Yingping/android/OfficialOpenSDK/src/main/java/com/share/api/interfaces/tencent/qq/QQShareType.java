package com.share.api.interfaces.tencent.qq;

/**
 * Created by aaron on 6/23/16.
 * QQ分享类型
 * 1.图文消息
 * 2.纯图片
 * 3.音乐
 * 4.应用
 */

public interface QQShareType<T> {

    T isDefault();

    T isImage();

    T isAudio();

    T isApp();

}
