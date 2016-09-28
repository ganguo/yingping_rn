package com.share.api.interfaces.tencent.qq.common;

/**
 * Created by aaron on 6/29/16.
 * （图文，音乐，应用类型共同需要的属性）
 * 除了纯图片类型的都需要的属性
 */
public interface MediaCommonOpt<T> {
    T setTitle(String title);

    T setSummary(String summary);
}
