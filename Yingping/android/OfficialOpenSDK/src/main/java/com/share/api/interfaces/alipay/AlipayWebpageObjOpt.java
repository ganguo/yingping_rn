package com.share.api.interfaces.alipay;

/**
 * Created by aaron on 6/30/16.
 */
public interface AlipayWebpageObjOpt<T> {

    T setWebpageUrl(String webpageUrl);

    T setTitle(String title);

    T setDescription(String description);

    T setImageUrl(String imageUrl);

    T setImagePath(String imagePath);

    T setImageResource(int imageResource);
}
