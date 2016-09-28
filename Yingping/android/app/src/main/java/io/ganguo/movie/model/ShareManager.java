package io.ganguo.movie.model;

import android.os.Bundle;
import android.os.SystemClock;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.share.api.ICallback;
import com.share.api.SimpleCallback;
import com.share.api.sina.AccessTokenKeeper;
import com.share.api.utils.ToastHelper;
import com.sina.weibo.sdk.api.share.BaseResponse;
import com.sina.weibo.sdk.api.share.IWeiboHandler;
import com.sina.weibo.sdk.auth.Oauth2AccessToken;
import com.sina.weibo.sdk.auth.WeiboAuthListener;
import com.sina.weibo.sdk.exception.WeiboException;
import com.tencent.tauth.IUiListener;
import com.tencent.tauth.UiError;

import io.ganguo.movie.R;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by aaron on 6/14/16.
 */
public class ShareManager extends ReactContextBaseJavaModule implements IWeiboHandler.Response {
    private static final String shareQQPlatform = "QQ";
    private static final String shareWechatPlatform = "Wechat";
    private static final String shareWeiboPlatform = "Weibo";
    private static final String shareMomentPlatform = "Moment";

    public ShareManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ShareManager";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(shareQQPlatform, "QQ");
        constants.put(shareWechatPlatform, "Wechat");
        constants.put(shareWeiboPlatform, "Weibo");
        constants.put(shareMomentPlatform, "Moment");
        return constants;
    }

    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }

    @ReactMethod
    public void shareContent(ReadableMap content, String type) {
        switch (type) {
            case shareQQPlatform:
                shareToQQ(content);
                break;
            case shareWeiboPlatform:
                shareToSina(content);
                break;
            case shareMomentPlatform:
                shareToMoments(content);
                break;
            case shareWechatPlatform:
                shareToWechat(content);
                break;
        }
    }

    @Override
    public void onResponse(BaseResponse baseResponse) {
    }

    public void shareToWechat(ReadableMap content) {
        com.share.api.ShareManager.shareToWechatFriends(getCurrentActivity(), callback)
                .isWebPage()
                .setWebpageUrl(content.getString("url"))
                .setTitle(content.getString("title"))
                .setDescription(content.getString("content"))
                .setImageResource(R.drawable.ic_launcher)
                .share();
    }

    public void shareToSina(ReadableMap content) {
        com.share.api.ShareManager
                .shareToSina(getCurrentActivity(), weiboAuthListener)
                .isWebPage()
                .setTitle(content.getString("title"))
                .setActionUrl(content.getString("url"))
                .setDescription(content.getString("content"))
                .setImageResource(R.drawable.ic_launcher)
                .setContent(content.getString("content"))
                .share();
    }

    public void shareToMoments(ReadableMap content) {
        com.share.api.ShareManager.shareToWechatMoments(getCurrentActivity(), callback)
                .isWebPage()
                .setWebpageUrl(content.getString("url"))
                .setTitle(content.getString("title"))
                .setDescription(content.getString("content"))
                .setImageResource(R.drawable.ic_launcher)
                .share();
    }

    public void shareToQQ(ReadableMap content) {
        com.share.api.ShareManager.shareToQQ(getCurrentActivity(), iUiListener)
                .isDefault()
                .setTargetUrl(content.getString("url"))
                .setTitle(content.getString("title"))
                .setSummary(content.getString("content"))
                .share();
    }

    ICallback callback = new SimpleCallback() {
        @Override
        public void onSuccess() {
            Toast.makeText(getReactApplicationContext(), "成功分享", Toast.LENGTH_LONG).show();
//            ToastHelper.showMessage(getCurrentActivity(), "成功分享");
        }

        @Override
        public void onFailed() {
//            ToastHelper.showMessage(getCurrentActivity(), "成功失败");
        }

        @Override
        public void onCancel() {
//            ToastHelper.showMessage(getCurrentActivity(), "成功取消");
        }

        @Override
        public void onFinally() {
//            ToastHelper.showMessage(getCurrentActivity(), "成功结束");
        }
    };

    //新浪all in one 的授权回调listener
    WeiboAuthListener weiboAuthListener = new WeiboAuthListener() {

        @Override
        public void onWeiboException(WeiboException arg0) {
            ToastHelper.showMessage(getCurrentActivity(), "WeiboException " + arg0.toString());
        }

        @Override
        public void onComplete(Bundle bundle) {
            // TODO Auto-generated method stub
            Oauth2AccessToken newToken = Oauth2AccessToken.parseAccessToken(bundle);
            AccessTokenKeeper.writeAccessToken(getCurrentActivity(), newToken);
        }

        @Override
        public void onCancel() {
        }
    };

    //QQ跟QQ空间设置回调接口
    IUiListener iUiListener = new IUiListener() {
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
}
