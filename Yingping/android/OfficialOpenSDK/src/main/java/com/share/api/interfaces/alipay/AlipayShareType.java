package com.share.api.interfaces.alipay;

/**
 * Created by aaron on 6/23/16.
 * 支付宝分享类型
 * 1.文本
 * 2.图片
 * 3.网页
 */

public interface AlipayShareType<T> {

    T isText();

    T isImage();

    T isWebpage();

}
