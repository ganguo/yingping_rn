package com.share.api.interfaces.sina;

/**
 * Created by aaron on 6/23/16.
 * 新浪分享类型
 * 1.网页
 * 2.视频
 * 3.音频
 * 4.音乐
 */

public interface SinaShareType<T> {

    T isWebPage();

    T isVideo();

    T isMusic();

    SinaMediaObjOpt isVoice();

}
