package com.share.api.interfaces.tencent.qzone;

/**
 * Created by aaron on 6/23/16.
 */
public interface QZoneBundleOpt {

    QZoneBundleOpt setTargetUrl(String targetUrl);

    QZoneBundleOpt setTitle(String title);

    QZoneBundleOpt setSummary(String summary);

    QZoneBundleOpt setImageUrl(String... imageUrls);

    void share();
}
