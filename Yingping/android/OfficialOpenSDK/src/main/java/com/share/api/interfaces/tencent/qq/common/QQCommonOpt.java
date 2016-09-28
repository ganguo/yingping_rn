package com.share.api.interfaces.tencent.qq.common;

import com.share.api.interfaces.common.CommonOpt;

/**
 * Created by aaron on 6/28/16.
 * 4种类型都需要的属性
 */
public interface QQCommonOpt<T> extends CommonOpt {
    T setAppName(String appName);
}
