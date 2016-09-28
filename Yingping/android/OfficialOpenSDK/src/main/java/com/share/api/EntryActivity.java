package com.share.api;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.share.api.sina.AccessTokenKeeper;
import com.share.api.utils.ToastHelper;
import com.sina.weibo.sdk.api.share.BaseResponse;
import com.sina.weibo.sdk.api.share.IWeiboHandler;
import com.sina.weibo.sdk.auth.Oauth2AccessToken;
import com.sina.weibo.sdk.auth.WeiboAuthListener;
import com.sina.weibo.sdk.constant.WBConstants;
import com.sina.weibo.sdk.exception.WeiboException;
import com.tencent.tauth.IUiListener;
import com.tencent.tauth.Tencent;
import com.tencent.tauth.UiError;


/**
 * Created by aaron on 5/12/16.
 */
public abstract class EntryActivity extends Activity implements IWeiboHandler.Response {
    public ICallback callback;
    //QQ的特殊回调监听
    public IUiListener iUiListener;
    public WeiboAuthListener weiboAuthListener;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        GGOfficiialSDK.mWeiboShareAPI.handleWeiboResponse(getIntent(), this);
        // init resources
        beforeInitView();
        initView();
        initCallbackListener();
        initListener();
        initData();
    }

    protected void initCallbackListener() {
        //QQ跟QQ空间设置回调接口
        iUiListener = new IUiListener() {
            @Override
            public void onCancel() {
                if (callback != null) {
                    callback.onCancel();
                }
            }

            @Override
            public void onComplete(Object response) {
                if (callback != null) {
                    callback.onSuccess();
                }
            }

            @Override
            public void onError(UiError e) {
                if (callback != null) {
                    callback.onFailed();
                }
            }
        };

        //新浪all in one 的授权回调listener
        weiboAuthListener = new WeiboAuthListener() {

            @Override
            public void onWeiboException(WeiboException arg0) {
                ToastHelper.showMessage(EntryActivity.this, "WeiboException " + arg0.toString());
            }

            @Override
            public void onComplete(Bundle bundle) {
                // TODO Auto-generated method stub
                Oauth2AccessToken newToken = Oauth2AccessToken.parseAccessToken(bundle);
                AccessTokenKeeper.writeAccessToken(EntryActivity.this, newToken);
            }

            @Override
            public void onCancel() {
            }
        };
    }

    protected abstract void initData();

    protected abstract void initView();

    protected abstract void beforeInitView();

    protected abstract void initListener();

    /**
     * 新浪回调
     *
     * @param baseResponse
     */
    @Override
    public void onResponse(BaseResponse baseResponse) {
        switch (baseResponse.errCode) {
            case WBConstants.ErrorCode.ERR_OK:
                if (callback != null) {
                    callback.onSuccess();
                }
                break;
            case WBConstants.ErrorCode.ERR_CANCEL:
                if (callback != null) {
                    callback.onCancel();
                }
                break;
            case WBConstants.ErrorCode.ERR_FAIL:
                if (callback != null) {
                    callback.onFailed();
                }
                break;
            default:
                if (callback != null) {
                    callback.onFinally();
                }
                break;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Tencent.onActivityResultData(requestCode, resultCode, data, iUiListener);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        GGOfficiialSDK.mWeiboShareAPI.handleWeiboResponse(intent, this);
    }


}
