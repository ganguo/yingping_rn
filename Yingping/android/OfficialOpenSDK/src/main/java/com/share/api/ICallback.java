package com.share.api;

/**
 * Created by Lynn on 3/25/16.
 */
public interface ICallback {
    /**
     * 分享成功
     */
    void onSuccess();

    /**
     * 分享取消
     */
    void onCancel();

    /**
     * 分享失败
     */
    void onFailed();

    /**
     * 分享回调最后调用
     */
    void onFinally();
}
