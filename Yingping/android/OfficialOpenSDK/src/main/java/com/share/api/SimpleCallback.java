package com.share.api;

import android.util.Log;

/**
 * 简单的share回调
 * Created by Lynn on 3/25/16.
 */
public abstract class SimpleCallback implements ICallback {

    @Override
    public void onCancel() {
        Log.d(SimpleCallback.class + "自定义回调方法", "分享取消");
    }

    @Override
    public void onFailed() {
        Log.d(SimpleCallback.class + "自定义回调方法", "分享失败");
    }

    @Override
    public void onFinally() {
        Log.d(SimpleCallback.class + "自定义回调方法", "分享结束");
    }
}
