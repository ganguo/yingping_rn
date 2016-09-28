package com.share.api.interfaces.alipay;

/**
 * Created by aaron on 6/30/16.
 */
public interface AlipayImageObjOpt<T> {

    T setImageUrl(String imageUrl);

    T setImagePath(String imagePath);

    T setImageResource(int imageResource);
}
