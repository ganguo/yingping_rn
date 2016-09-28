package com.share.api.tencent.qqzone;

import android.app.Activity;
import android.os.Bundle;

import com.share.api.GGOfficiialSDK;
import com.share.api.interfaces.tencent.qzone.QZoneBundleOpt;
import com.tencent.connect.share.QzoneShare;
import com.tencent.tauth.IUiListener;

import java.util.ArrayList;
import java.util.Arrays;


/**
 * 负责初始化QQ分享需要的资源, 并且调用分享
 * Created by Aaron on 6/29/16.
 */
public class QqZoneShareBuilder {
    private static Activity mActivity;
    private static Bundle bundle;
    private static IUiListener mIUiListener;

    public static QZoneBundleOptType with(Activity activity, IUiListener iUiListener) {
        mIUiListener = iUiListener;
        return new QZoneBundleOptType(activity);
    }

    /**
     * 分享到QQ空间
     */
    public static class QZoneBundleOptType implements QZoneBundleOpt {

        public QZoneBundleOptType(Activity activity) {
            mActivity = activity;
            //分享的内容bundle
            bundle = new Bundle();
            bundle.putInt(QzoneShare.SHARE_TO_QZONE_KEY_TYPE, QzoneShare.SHARE_TO_QZONE_TYPE_IMAGE_TEXT);
        }

        @Override
        public QZoneBundleOpt setTargetUrl(String targetUrl) {
            bundle.putString(QzoneShare.SHARE_TO_QQ_TARGET_URL, targetUrl);
            return this;
        }

        @Override
        public QZoneBundleOpt setTitle(String title) {
            bundle.putString(QzoneShare.SHARE_TO_QQ_TITLE, title);
            return this;
        }

        @Override
        public QZoneBundleOpt setSummary(String summary) {
            bundle.putString(QzoneShare.SHARE_TO_QQ_SUMMARY, summary);
            return this;
        }

        @Override
        public QZoneBundleOpt setImageUrl(String... imageUrls) {
            if (imageUrls.length <= 0) {
                return this;
            }
            ArrayList<String> imageList = new ArrayList<>();
            imageList.addAll(Arrays.asList(imageUrls));
            bundle.putStringArrayList(QzoneShare.SHARE_TO_QQ_IMAGE_URL, imageList);
            return this;
        }

        @Override
        public void share() {
            GGOfficiialSDK.mTencentAPI.shareToQzone(mActivity, bundle, mIUiListener);
        }

    }

}
