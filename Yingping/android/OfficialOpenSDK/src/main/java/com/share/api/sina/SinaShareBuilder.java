package com.share.api.sina;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.widget.Toast;

import com.share.api.base.OfficialConstant;
import com.share.api.interfaces.sina.SinaCommonOpt;
import com.share.api.interfaces.sina.SinaMediaObjOpt;
import com.share.api.interfaces.sina.SinaShareType;
import com.share.api.utils.OfficialHelperUtil;
import com.share.api.utils.Strings;
import com.share.api.utils.ToastHelper;
import com.sina.weibo.sdk.api.BaseMediaObject;
import com.sina.weibo.sdk.api.ImageObject;
import com.sina.weibo.sdk.api.MusicObject;
import com.sina.weibo.sdk.api.TextObject;
import com.sina.weibo.sdk.api.VideoObject;
import com.sina.weibo.sdk.api.VoiceObject;
import com.sina.weibo.sdk.api.WebpageObject;
import com.sina.weibo.sdk.api.WeiboMultiMessage;
import com.sina.weibo.sdk.auth.WeiboAuthListener;
import com.sina.weibo.sdk.utils.Utility;

import java.io.File;


/**
 * 负责初始化新浪分享需要的资源, 并且调用分享
 * Created by Aaron on 6/24/16.
 */
public class SinaShareBuilder {
    private static WeiboMultiMessage weiboMessage;
    private static TextObject textObject;
    private static ImageObject imageObject;
    private static BaseMediaObject baseMediaObject;
    private static Activity mActivity;
    private static WeiboAuthListener mWeiboAuthListener;
    private static boolean inThead = false;

    public static ShareType with(Activity activity, WeiboAuthListener weiboAuthListener) {
        mWeiboAuthListener = weiboAuthListener;
        return new ShareType(activity);
    }

    public static class ShareType implements SinaShareType {

        public ShareType(Activity activity) {
            weiboMessage = new WeiboMultiMessage();
            mActivity = activity;
        }

        @Override
        public WebPageObjStep isWebPage() {
            return new WebPageObjStep();
        }

        @Override
        public SinaMediaObjStep isVideo() {
            return new SinaMediaObjStep(OfficialConstant.SINA_VIDEO_TYPE);
        }

        @Override
        public SinaMediaObjStep isMusic() {
            return new SinaMediaObjStep(OfficialConstant.SINA_MUSIC_TYPE);
        }

        @Override
        public SinaMediaObjStep isVoice() {
            return new SinaMediaObjStep(OfficialConstant.SINA_VOICE_TYPE);
        }
    }

    /**
     * 分享网页类型
     */
    public static class WebPageObjStep implements SinaCommonOpt<WebPageObjStep> {

        public WebPageObjStep() {
            baseMediaObject = new WebpageObject();
            baseMediaObject.identify = Utility.generateGUID();
        }

        @Override
        public WebPageObjStep setActionUrl(String actionUrl) {
            if (Strings.isNotEmpty(actionUrl)) {
                baseMediaObject.actionUrl = actionUrl;
            }
            return this;
        }

        @Override
        public WebPageObjStep setTitle(String title) {
            if (Strings.isNotEmpty(title)) {
                baseMediaObject.title = title;
            }
            return this;
        }

        @Override
        public WebPageObjStep setDescription(String description) {
            if (Strings.isNotEmpty(description)) {
                baseMediaObject.description = description;
            }
            return this;
        }

        @Override
        public WebPageObjStep setContent(String content) {
            if (Strings.isNotEmpty(content)) {
                textObject = new TextObject();
                textObject.text = content;
                weiboMessage.textObject = textObject;
            }
            return this;
        }

        @Override
        public WebPageObjStep setImageUrl(final String imageUrl) {
            if (Strings.isNotEmpty(imageUrl)) {
                inThead = true;
                new Thread() {
                    public void run() {
                        try {
                            Bitmap thumb = Bitmap.createScaledBitmap(OfficialHelperUtil.GetLocalOrNetBitmap(imageUrl), 120, 120, true);//压缩Bitmap
                            setImageObj(thumb);
                            inThead = false;
                            share();
                        } catch (Exception e) {
                            inThead = false;
                            e.printStackTrace();
                        }
                    }
                }.start();

            }
            return this;
        }

        @Override
        public WebPageObjStep setImagePath(String imagePath) {
            if (Strings.isNotEmpty(imagePath)) {
                File file = new File(imagePath);
                if (!file.exists()) {
                    Toast.makeText(mActivity, "该本地图片不存在", Toast.LENGTH_LONG).show();
                    return this;
                }
                Bitmap bitmap = OfficialHelperUtil.dealImageSize(imagePath);
                setImageObj(bitmap);
            }
            return this;
        }

        @Override
        public WebPageObjStep setImageResource(int imageResource) {
            if (imageResource != 0) {
                Bitmap bitmap = BitmapFactory.decodeResource(mActivity.getResources(), imageResource);
                setImageObj(bitmap);
            }
            return this;
        }

        @Override
        public void share() {
            if (inThead) {
                return;
            }
            weiboMessage.mediaObject = baseMediaObject;
//                SinaShare.shareWithClient(mActivity, weiboMessage, mWeiboAuthListener);
            //默认为有客户端调用客户端，没有则调用网页。
            SinaShare.shareAllInOne(mActivity, weiboMessage, mWeiboAuthListener);
        }
    }

    /**
     * 分享音乐，音频，视频类型
     */
    public static class SinaMediaObjStep extends WebPageObjStep implements SinaMediaObjOpt {

        public SinaMediaObjStep(String shareType) {
            switchShareType(shareType);
            baseMediaObject.identify = Utility.generateGUID();
        }

        @Override
        public SinaMediaObjStep setDataUrl(String dataUrl) {
            if (Strings.isNotEmpty(dataUrl)) {
                if (baseMediaObject instanceof MusicObject) {
                    ((MusicObject) baseMediaObject).dataUrl = dataUrl;
                }

                if (baseMediaObject instanceof VideoObject) {
                    ((VideoObject) baseMediaObject).dataUrl = dataUrl;
                }

                if (baseMediaObject instanceof VoiceObject) {
                    ((VoiceObject) baseMediaObject).dataUrl = dataUrl;
                }
            }
            return this;
        }

        @Override
        public SinaMediaObjStep setDataHdUrl(String dataHdUrl) {
            if (Strings.isNotEmpty(dataHdUrl)) {
                if (baseMediaObject instanceof MusicObject) {
                    ((MusicObject) baseMediaObject).dataHdUrl = dataHdUrl;
                }

                if (baseMediaObject instanceof VideoObject) {
                    ((VideoObject) baseMediaObject).dataHdUrl = dataHdUrl;
                }

                if (baseMediaObject instanceof VoiceObject) {
                    ((VoiceObject) baseMediaObject).dataHdUrl = dataHdUrl;
                }
            }
            return this;
        }

        @Override
        public SinaMediaObjOpt setDuration(int duration) {
            if (duration > 0) {
                if (baseMediaObject instanceof MusicObject) {
                    ((MusicObject) baseMediaObject).duration = duration;
                }

                if (baseMediaObject instanceof VideoObject) {
                    ((VideoObject) baseMediaObject).duration = duration;
                }

                if (baseMediaObject instanceof VoiceObject) {
                    ((VoiceObject) baseMediaObject).duration = duration;
                }
            }
            return this;
        }

        @Override
        public SinaMediaObjStep setActionUrl(String actionUrl) {
            if (Strings.isNotEmpty(actionUrl)) {
                baseMediaObject.actionUrl = actionUrl;
            }
            return this;
        }

        @Override
        public SinaMediaObjStep setTitle(String title) {
            if (Strings.isNotEmpty(title)) {
                baseMediaObject.title = title;
            }
            return this;
        }

        @Override
        public SinaMediaObjStep setDescription(String description) {
            if (Strings.isNotEmpty(description)) {
                baseMediaObject.description = description;
            }
            return this;
        }

        @Override
        public SinaMediaObjStep setContent(String content) {
            if (Strings.isNotEmpty(content)) {
                textObject = new TextObject();
                textObject.text = content;
                weiboMessage.textObject = textObject;
            }
            return this;
        }

        @Override
        public SinaMediaObjStep setImageUrl(final String imageUrl) {
            if (Strings.isNotEmpty(imageUrl)) {

                inThead = true;
                new Thread() {
                    public void run() {
                        try {
                            Bitmap thumb = Bitmap.createScaledBitmap(OfficialHelperUtil.GetLocalOrNetBitmap(imageUrl), 120, 120, true);//压缩Bitmap
                            setImageObj(thumb);
                            inThead = false;
                        } catch (Exception e) {
                            inThead = false;
                            e.printStackTrace();
                        }
                    }
                }.start();
            }
            return this;
        }

        @Override
        public SinaMediaObjStep setImagePath(String imagePath) {
            if (Strings.isNotEmpty(imagePath)) {
                File file = new File(imagePath);
                if (!file.exists()) {
                    Toast.makeText(mActivity, "该本地图片不存在", Toast.LENGTH_LONG).show();
                    return this;
                }
                Bitmap bitmap = OfficialHelperUtil.dealImageSize(imagePath);
                setImageObj(bitmap);
            }
            return this;
        }

        @Override
        public SinaMediaObjStep setImageResource(int imageResource) {
            if (imageResource != 0) {
                Bitmap bitmap = BitmapFactory.decodeResource(mActivity.getResources(), imageResource);
                setImageObj(bitmap);
            }
            return this;
        }

        @Override
        public void share() {
            if (inThead) {
                return;
            }
            weiboMessage.mediaObject = baseMediaObject;
//                SinaShare.shareWithClient(mActivity, weiboMessage, mWeiboAuthListener);
            //默认为有客户端调用客户端，没有则调用网页。
            SinaShare.shareAllInOne(mActivity, weiboMessage, mWeiboAuthListener);
        }
    }

    /**
     * 根据分享类型来初始化对应的对象
     *
     * @param shareType
     */
    private static void switchShareType(String shareType) {
        switch (shareType) {
            case OfficialConstant.SINA_MUSIC_TYPE:
                baseMediaObject = new MusicObject();
                break;
            case OfficialConstant.SINA_VIDEO_TYPE:
                baseMediaObject = new VideoObject();
                break;
            case OfficialConstant.SINA_VOICE_TYPE:
                baseMediaObject = new VoiceObject();
                break;
        }
    }

    private static void setImageObj(Bitmap bitmap) {
        imageObject = new ImageObject();
        imageObject.setImageObject(bitmap);
        weiboMessage.imageObject = imageObject;
        baseMediaObject.setThumbImage(bitmap);
    }

}
