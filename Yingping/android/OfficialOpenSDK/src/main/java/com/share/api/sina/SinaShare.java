package com.share.api.sina;

import android.app.Activity;
import android.util.Log;

import com.share.api.GGOfficiialSDK;
import com.share.api.utils.ToastHelper;
import com.sina.weibo.sdk.api.WeiboMultiMessage;
import com.sina.weibo.sdk.api.share.IWeiboShareAPI;
import com.sina.weibo.sdk.api.share.SendMultiMessageToWeiboRequest;
import com.sina.weibo.sdk.api.share.WeiboShareSDK;
import com.sina.weibo.sdk.auth.Oauth2AccessToken;
import com.sina.weibo.sdk.auth.WeiboAuthListener;


/**
 * Created by aaron on 6/23/16.
 */
public class SinaShare {
    private static boolean isClientOnly;

    public static void shareWithClient(Activity activity, WeiboMultiMessage weiboMessage, WeiboAuthListener weiboAuthListener) {
        if (GGOfficiialSDK.mWeiboShareAPI.isWeiboAppSupportAPI()) {
            /*ApiUtils.BUILD_INT_VER_2_2*/
            if (GGOfficiialSDK.mWeiboShareAPI.getWeiboAppSupportAPI() >= 10351) {
                isClientOnly = true;
                sendMultiMessage(activity, weiboMessage, weiboAuthListener);
            } else {
                // 2.2以前的版本不支持分享声音
                ToastHelper.showMessage(activity, "目前客户端版本不支持分享声音，请升级客户端版本。");
            }
        } else {
            //API 不支持新浪分享
            ToastHelper.showMessage(activity, "微博客户端不支持 SDK 分享或微博客户端未安装或微博客户端是非官方版本。");
        }
    }

    public static void shareAllInOne(Activity activity, WeiboMultiMessage weiboMessage, WeiboAuthListener weiboAuthListener) {
        isClientOnly = false;
        sendMultiMessage(activity, weiboMessage, weiboAuthListener);
    }

    /**
     * 第三方应用发送请求消息到微博，唤起微博分享界面。
     * 注意：当 {@link IWeiboShareAPI#getWeiboAppSupportAPI()} >= 10351 时，支持同时分享多条消息，
     * 同时可以分享文本、图片以及其它媒体资源（网页、音乐、视频、声音中的一种）。
     * <p>
     */
    public static void sendMultiMessage(Activity activity, WeiboMultiMessage weiboMessage, WeiboAuthListener weiboAuthListener) {
        if (weiboMessage == null) {
            return;
        }
        // 2. 初始化从第三方到微博的消息请求
        SendMultiMessageToWeiboRequest request = new SendMultiMessageToWeiboRequest();
        // 用transaction唯一标识一个请求
        request.transaction = String.valueOf(System.currentTimeMillis());
        request.multiMessage = weiboMessage;

        // 3. 发送请求消息到微博，唤起微博分享界面
        if (isClientOnly) {
            GGOfficiialSDK.mWeiboShareAPI.sendRequest(activity, request);
        } else {
            Oauth2AccessToken accessToken = AccessTokenKeeper.readAccessToken(activity);
            String token = "";
            if (accessToken != null) {
                token = accessToken.getToken();
            }
            GGOfficiialSDK.mWeiboShareAPI.sendRequest(activity, request, GGOfficiialSDK.mAuthInfo, token, weiboAuthListener);
        }
    }
}
