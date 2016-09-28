package com.share.api.interfaces.sina;

import com.share.api.interfaces.common.CommonOpt;

/**
 * Created by aaron on 6/28/16.
 * 新浪微博分享公用属性
 */
public interface SinaCommonOpt<T> extends CommonOpt {
    T setActionUrl(String actionUrl);

    T setTitle(String title);

    T setDescription(String description);

    T setContent(String content);

    T setImageUrl(String imageUrl);

    T setImagePath(String imagePath);

    T setImageResource(int imageResource);
}
