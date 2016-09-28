package com.share.api;

import android.app.Activity;

import com.share.api.sina.SinaShareBuilder;
import com.share.api.tencent.qq.QQShareBuilder;
import com.share.api.tencent.qqzone.QqZoneShareBuilder;
import com.share.api.tencent.wechat.WechatShareBuilder;
import com.sina.weibo.sdk.auth.WeiboAuthListener;
import com.tencent.mm.sdk.modelmsg.SendMessageToWX;
import com.tencent.tauth.IUiListener;

/**
 * share wrapper helper
 * Created by Lynn on 3/25/16.
 */
public class ShareManager {
    //防止实例化
    private ShareManager() {
    }

    public static SinaShareBuilder.ShareType shareToSina(Activity activity, WeiboAuthListener weiboAuthListener) {
        return SinaShareBuilder.with(activity, weiboAuthListener);
    }

    public static QQShareBuilder.ShareType shareToQQ(Activity activity, IUiListener iUiListener) {
        return QQShareBuilder.with(activity, iUiListener);
    }

    public static QqZoneShareBuilder.QZoneBundleOptType shareToQQZone(Activity activity, IUiListener iUiListener) {
        return QqZoneShareBuilder.with(activity, iUiListener);
    }

    public static WechatShareBuilder.ShareType shareToWechatFriends(Activity activity, ICallback callback) {
        return WechatShareBuilder.with(activity, SendMessageToWX.Req.WXSceneSession, callback);
    }

    public static WechatShareBuilder.ShareType shareToWechatMoments(Activity activity, ICallback callback) {
        return WechatShareBuilder.with(activity, SendMessageToWX.Req.WXSceneTimeline, callback);
    }

}
