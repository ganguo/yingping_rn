package com.share.api.interfaces.tencent.wechat.common;

/**
 * Created by aaron on 6/30/16.
 */
public interface WXImageCommonObjOpt<T> {

    T setImageUrl(String imageUrl);

    T setImagePath(String imagePath);

    T setImageResource(int imageResource);
}
