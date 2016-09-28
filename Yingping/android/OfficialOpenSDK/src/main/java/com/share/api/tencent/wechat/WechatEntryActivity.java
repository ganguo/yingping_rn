package com.share.api.tencent.wechat;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.share.api.GGOfficiialSDK;
import com.share.api.ICallback;
import com.tencent.mm.sdk.constants.ConstantsAPI;
import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.modelmsg.SendAuth;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;

/**
 * TODO 当使用GGShareApi的时候, 要获得微信的回调，要在app module下新建一个wxapi package
 * TODO 然后新建一个WXEntryActivity的类, 继承WechatEntryActivity, 不然无法收到微信分享的回调
 * demo 写法
 * 微信的分享后回调的实际处理的activity
 * Created by Lynn on 3/30/16.
 */
public class WechatEntryActivity extends Activity implements IWXAPIEventHandler {
    public static String code;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        GGOfficiialSDK.mIwxAPI.handleIntent(getIntent(), this);
        Log.e("onResp: ", "niu comming");
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        GGOfficiialSDK.mIwxAPI.handleIntent(intent, this);
    }

    @Override
    public void onReq(BaseReq baseReq) {
    }

    @Override
    public void onResp(BaseResp baseResp) {
        ICallback iCallback = WechatShareBuilder.getICallback();
        switch (baseResp.errCode) {
            case BaseResp.ErrCode.ERR_OK:
                if (iCallback != null) {
                    iCallback.onSuccess();
                }
                break;
            case BaseResp.ErrCode.ERR_USER_CANCEL:
                if (iCallback != null) {
                    iCallback.onCancel();
                }
                break;
            case BaseResp.ErrCode.ERR_AUTH_DENIED:
                if (iCallback != null) {
                    iCallback.onFailed();
                }
                break;
            default:
                if (iCallback != null) {
                    iCallback.onFinally();
                }
                break;
        }
        Log.e("onResp: ", "测试 comming");
        if (iCallback != null) {
            WechatShareBuilder.setICallback(null);
        }
        finish();
    }

    public static String getCode() {
        return code;
    }

    public static void setCode(String code) {
        WechatEntryActivity.code = code;
    }
}

