package com.share.api.tencent.wechat;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.widget.Toast;

import com.share.api.GGOfficiialSDK;
import com.share.api.ICallback;
import com.share.api.base.OfficialConstant;
import com.share.api.interfaces.common.CommonOpt;
import com.share.api.interfaces.tencent.wechat.WXMusicObjOpt;
import com.share.api.interfaces.tencent.wechat.WXShareType;
import com.share.api.interfaces.tencent.wechat.WXTextObjOpt;
import com.share.api.interfaces.tencent.wechat.WXVideoObjOpt;
import com.share.api.interfaces.tencent.wechat.WXWebpageObjOpt;
import com.share.api.interfaces.tencent.wechat.common.WXImageCommonObjOpt;
import com.share.api.interfaces.tencent.wechat.common.WXMediaCommonObjOpt;
import com.share.api.utils.OfficialHelperUtil;
import com.share.api.utils.Strings;
import com.share.api.utils.ToastHelper;
import com.tencent.mm.sdk.modelmsg.SendMessageToWX;
import com.tencent.mm.sdk.modelmsg.WXImageObject;
import com.tencent.mm.sdk.modelmsg.WXMediaMessage;
import com.tencent.mm.sdk.modelmsg.WXMusicObject;
import com.tencent.mm.sdk.modelmsg.WXTextObject;
import com.tencent.mm.sdk.modelmsg.WXVideoObject;
import com.tencent.mm.sdk.modelmsg.WXWebpageObject;

import java.io.File;

/**
 * 负责初始化Wechat分享需要的资源, 并且调用分享
 * Created by aaron on 6/30/16.
 */
public class WechatShareBuilder {
    private static Activity mActivity;
    private static WXMediaMessage wxMediaMessage;
    private static SendMessageToWX.Req req;
    private static WXMediaMessage.IMediaObject object;
    public static ICallback iCallback;
    private static int mScene = 0;
    private static boolean inThead = false;

    private WechatShareBuilder() {
    }

    public static ShareType with(Activity activity, int scene, ICallback callback) {
        mActivity = activity;
        setICallback(callback);
        mScene = scene;
        return new ShareType();
    }

    public static class ShareType implements WXShareType {

        public ShareType() {
            wxMediaMessage = new WXMediaMessage();
            req = new SendMessageToWX.Req();
        }

        //文本类型
        @Override
        public WXWXTextObjStep isText() {
            //用于唯一标识这个请求
            req.transaction = OfficialHelperUtil.buildTransaction(OfficialConstant.WECHAT_TEXT_TYPE);
            object = new WXTextObject();
            return new WXWXTextObjStep();
        }

        //纯图片类型
        @Override
        public WeWXImageCommonStep isImage() {
            //用于唯一标识这个请求
            req.transaction = OfficialHelperUtil.buildTransaction(OfficialConstant.WECHAT_IMAGE_TYPE);
            wxMediaMessage = new WXMediaMessage(object);
            return new WeWXImageCommonStep(true);
        }

        //音乐类型
        @Override
        public WXWXMusicObjStep isMusic() {
            req.transaction = OfficialHelperUtil.buildTransaction(OfficialConstant.WECHAT_MUSIC_TYPE);
            object = new WXMusicObject();
            return new WXWXMusicObjStep();
        }

        //音频类型
        @Override
        public WXWXVideoObjStep isVideo() {
            req.transaction = OfficialHelperUtil.buildTransaction(OfficialConstant.WECHAT_VIDEO_TYPE);
            object = new WXVideoObject();
            wxMediaMessage = new WXMediaMessage(object);
            return new WXWXVideoObjStep();
        }

        //网页类型
        @Override
        public WXWXWebpageObjStep isWebPage() {
            req.transaction = OfficialHelperUtil.buildTransaction(OfficialConstant.WECHAT_WEBPAGE_TYPE);
            object = new WXWebpageObject();
            wxMediaMessage = new WXMediaMessage(object);
            return new WXWXWebpageObjStep();
        }
    }

    public static class WeChatCommonShareStep implements CommonOpt {

        @Override
        public void share() {
            if (inThead) {
                return;
            }
            wxMediaMessage.mediaObject = object;
            req.message = wxMediaMessage;
            req.scene = mScene;
            if (!GGOfficiialSDK.mIwxAPI.isWXAppInstalled()) {
                ToastHelper.showMessage(mActivity, "您的微信版本过低或未安装微信，需要安装微信才能使用...");
                return;
            }
            GGOfficiialSDK.mIwxAPI.sendReq(req);
        }
    }

    /**
     * 图片处理接口
     */
    public static class WeWXImageCommonStep extends WeChatCommonShareStep implements WXImageCommonObjOpt {
        private boolean isImageType = false;

        public WeWXImageCommonStep(boolean isImageType) {
            this.isImageType = isImageType;
        }


        @Override
        public WeWXImageCommonStep setImageUrl(final String imageUrl) {
            if (Strings.isNotEmpty(imageUrl)) {
                inThead = true;
                Thread thread = new Thread() {
                    public void run() {
                        try {
                            Bitmap thumb = Bitmap.createScaledBitmap(OfficialHelperUtil.GetLocalOrNetBitmap(imageUrl), 120, 120, true);//压缩Bitmap
                            if (isImageType) {
                                object = new WXImageObject(thumb);
                            }
                            wxMediaMessage.thumbData = OfficialHelperUtil.bmpToByteArray(thumb, true);
                            inThead = false;
//                        bitmap = BitmapFactory.decodeStream(new URL(imageUrl).openStream());

                            share();
                        } catch (Exception e) {
                            inThead = false;
                            e.printStackTrace();
                        }
                    }
                };
                thread.start();
            }

            return this;
        }

        @Override
        public WeWXImageCommonStep setImagePath(String imagePath) {
            File file = new File(imagePath);
            if (!file.exists()) {
                Toast.makeText(mActivity, "该本地图片不存在", Toast.LENGTH_LONG).show();
                return this;
            }
            //因为一些图片太大，容易导致OOM，所以先处理下
            Bitmap bitmap = OfficialHelperUtil.dealImageSize(imagePath);
            if (isImageType) {
                object = new WXImageObject(bitmap);
            }
            //设置缩略图
            if (bitmap != null) {
                Bitmap thumbBmp = OfficialHelperUtil.centerSquareScaleBitmap(bitmap, 150);
                wxMediaMessage.thumbData = OfficialHelperUtil.bmpToByteArray(thumbBmp, true);
                if (!bitmap.isRecycled()) {
                    // 回收图片所占的内存
                    bitmap.recycle();
                    // 提醒系统及时回收
                    System.gc();
                }
            }
            return this;
        }

        @Override
        public WeWXImageCommonStep setImageResource(int imageResource) {
            Bitmap bitmap = BitmapFactory.decodeResource(mActivity.getResources(), imageResource);
            if (isImageType) {
                object = new WXImageObject(bitmap);
            }
            //设置缩略图
            if (bitmap != null) {
                Bitmap thumbBmp = OfficialHelperUtil.centerSquareScaleBitmap(bitmap, 150);
                wxMediaMessage.thumbData = OfficialHelperUtil.bmpToByteArray(thumbBmp, true);
                if (!bitmap.isRecycled()) {
                    // 回收图片所占的内存
                    bitmap.recycle();
                    // 提醒系统及时回收
                    System.gc();
                }
            }
            return this;
        }
    }

    public static class WeChatCommonStep extends WeWXImageCommonStep implements WXMediaCommonObjOpt {

        public WeChatCommonStep(boolean isImageType) {
            super(isImageType);
        }

        @Override
        public WeChatCommonStep setTitle(String title) {
            if (Strings.isNotEmpty(title)) {
                wxMediaMessage.title = title;
            }
            return this;
        }

        @Override
        public WeChatCommonStep setDescription(String description) {
            if (Strings.isNotEmpty(description)) {
                wxMediaMessage.description = description;
            }
            return this;
        }
    }

    /**
     * 分享文本类型
     */
    public static class WXWXTextObjStep extends WeChatCommonShareStep implements WXTextObjOpt {

        @Override
        public WXWXTextObjStep setText(String text) {
            if (Strings.isNotEmpty(text)) {
                ((WXTextObject) object).text = text;
            }
            return this;
        }
    }

    /**
     * 分享音乐类型
     */
    public static class WXWXMusicObjStep extends WeChatCommonStep implements WXMusicObjOpt {

        public WXWXMusicObjStep() {
            super(false);
        }

        @Override
        public WXWXMusicObjStep setMusicUrl(String musicUrl) {
            if (Strings.isNotEmpty(musicUrl)) {
                ((WXMusicObject) object).musicDataUrl = musicUrl;
            }
            return this;
        }
    }

    /**
     * 分享视频类型
     */
    public static class WXWXVideoObjStep extends WeChatCommonStep implements WXVideoObjOpt {

        public WXWXVideoObjStep() {
            super(false);
        }

        @Override
        public WXWXVideoObjStep setVideoUrl(String videoUrl) {
            if (Strings.isNotEmpty(videoUrl)) {
                ((WXVideoObject) object).videoUrl = videoUrl;
            }
            return this;
        }
    }

    /**
     * 分享网页类型
     */
    public static class WXWXWebpageObjStep extends WeChatCommonStep implements WXWebpageObjOpt {

        public WXWXWebpageObjStep() {
            super(false);
        }

        @Override
        public WXWXWebpageObjStep setWebpageUrl(String webpageUrl) {
            if (Strings.isNotEmpty(webpageUrl)) {
                ((WXWebpageObject) object).webpageUrl = webpageUrl;
            }
            return this;
        }
    }

    public static ICallback getICallback() {
        return iCallback;
    }

    public static void setICallback(ICallback iCallback) {
        WechatShareBuilder.iCallback = iCallback;
    }
}
