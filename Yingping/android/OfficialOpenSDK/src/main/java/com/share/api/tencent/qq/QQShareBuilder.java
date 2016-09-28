package com.share.api.tencent.qq;

import android.app.Activity;
import android.os.Bundle;

import com.share.api.GGOfficiialSDK;
import com.share.api.interfaces.tencent.qq.QQAudioTypeOpt;
import com.share.api.interfaces.tencent.qq.QQImageTypeOpt;
import com.share.api.interfaces.tencent.qq.QQShareType;
import com.share.api.interfaces.tencent.qq.common.ImageCommonOpt;
import com.share.api.interfaces.tencent.qq.common.MediaCommonOpt;
import com.share.api.interfaces.tencent.qq.common.QQCommonOpt;
import com.share.api.interfaces.tencent.qq.common.TargetCommonOpt;
import com.share.api.utils.Strings;
import com.share.api.utils.ToastHelper;
import com.tencent.connect.share.QQShare;
import com.tencent.tauth.IUiListener;



/**
 * 负责初始化QQ分享需要的资源, 并且调用分享
 * Created by Aaron on 6/29/16.
 */
public class QQShareBuilder {
    private static Activity mActivity;
    private static Bundle bundle;
    private static IUiListener mIUiListener;

    public static ShareType with(Activity activity, IUiListener iUiListener) {
        mIUiListener = iUiListener;
        return new ShareType(activity);
    }

    public static class ShareType implements QQShareType {

        public ShareType(Activity activity) {
            mActivity = activity;
            //分享的内容bundle
            bundle = new Bundle();
        }

        //默认为分享图文
        @Override
        public DefaultStyle isDefault() {
            bundle.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_DEFAULT);
            return new DefaultStyle();
        }

        //分享纯图片
        @Override
        public ImageStyle isImage() {
            bundle.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_IMAGE);
            return new ImageStyle();
        }

        //分享音乐
        @Override
        public AudioStyle isAudio() {
            bundle.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_AUDIO);
            return new AudioStyle();
        }

        //分享应用
        @Override
        public MediaCommonStep isApp() {
            bundle.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_APP);
            return new MediaCommonStep();
        }
    }

    /**
     * 4种类型公用属性
     */
    public static class QQCommonStep implements QQCommonOpt {

        @Override
        public QQCommonStep setAppName(String appName) {
            bundle.putString(QQShare.SHARE_TO_QQ_APP_NAME, appName);
            return this;
        }

        @Override
        public void share() {
            if(!GGOfficiialSDK.mTencentAPI.isSupportSSOLogin(mActivity)){
                ToastHelper.showMessage(mActivity,"请先安装QQ客户端！");
                return;
            }
            GGOfficiialSDK.mTencentAPI.shareToQQ(mActivity, bundle, mIUiListener);
        }
    }

    /**
     * 图文，音乐，应用类型共用属性（除纯图片类型）,分享应用类型
     */
    public static class MediaCommonStep extends QQCommonStep implements MediaCommonOpt, ImageCommonOpt {

        @Override
        public MediaCommonStep setTitle(String title) {
            if (Strings.isNotEmpty(title)) {
                bundle.putString(QQShare.SHARE_TO_QQ_TITLE, title);
            }
            return this;
        }

        @Override
        public MediaCommonStep setSummary(String summary) {
            if (Strings.isNotEmpty(summary)) {
                bundle.putString(QQShare.SHARE_TO_QQ_SUMMARY, summary);
            }
            return this;
        }

        @Override
        public MediaCommonStep setImageUrl(String imageUrl) {
            if (Strings.isNotEmpty(imageUrl)) {
                bundle.putString(QQShare.SHARE_TO_QQ_IMAGE_URL, imageUrl);
            }
            return this;
        }

        @Override
        public MediaCommonStep setImagePath(String imagePath) {
            if (Strings.isNotEmpty(imagePath)) {
                bundle.putString(QQShare.SHARE_TO_QQ_IMAGE_URL, imagePath);
            }
            return this;
        }
    }

    /**
     * 分享图文类型
     */
    public static class DefaultStyle extends MediaCommonStep implements TargetCommonOpt {

        @Override
        public DefaultStyle setTargetUrl(String targetUrl) {
            if (Strings.isNotEmpty(targetUrl)) {
                bundle.putString(QQShare.SHARE_TO_QQ_TARGET_URL, targetUrl);
            }
            return this;
        }
    }

    /**
     * 分享纯图片类型
     */
    public static class ImageStyle extends QQCommonStep implements QQImageTypeOpt {
        @Override
        public QQImageTypeOpt setImagePath(String imagePath) {
            if (Strings.isNotEmpty(imagePath)) {
                bundle.putString(QQShare.SHARE_TO_QQ_IMAGE_LOCAL_URL, imagePath);
            }
            return this;
        }
    }

    /**
     * 分享音乐类型
     */
    public static class AudioStyle extends DefaultStyle implements QQAudioTypeOpt {

        @Override
        public QQAudioTypeOpt setAudioUrl(String audioUrl) {
            if (Strings.isNotEmpty(audioUrl)) {
                bundle.putString(QQShare.SHARE_TO_QQ_AUDIO_URL, audioUrl);
            }
            return this;
        }
    }
}
