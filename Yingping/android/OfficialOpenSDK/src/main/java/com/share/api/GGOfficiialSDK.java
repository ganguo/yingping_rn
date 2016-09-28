package com.share.api;

import android.content.Context;

import com.sina.weibo.sdk.api.share.IWeiboShareAPI;
import com.sina.weibo.sdk.api.share.WeiboShareSDK;
import com.sina.weibo.sdk.auth.AuthInfo;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import com.tencent.tauth.Tencent;

/**
 * 官方分享SDK
 * Created by aaron on 4/6/16.
 */
public class GGOfficiialSDK {
    /**
     * 微信分享接口实例
     */
    public static IWXAPI mIwxAPI;
    /**
     * QQ分享接口实例
     */
    public static Tencent mTencentAPI;

    /**
     * 微博微博分享接口实例
     */
    public static IWeiboShareAPI mWeiboShareAPI;

    /**
     * 微信好友 + 朋友圈
     */
    public static String Wechat_AppId;
    public static String Wechat_AppSecret;

    /**
     * QQ
     */
    public static String QQ_App_Id;

    /**
     * 当前 DEMO 应用的 APP_KEY，第三方应用应该使用自己的 APP_KEY 替换该 APP_KEY
     */
    public static String Sina_App_Key;
    /**
     * 当前 DEMO 应用的回调页，第三方应用可以使用自己的回调页。
     * 建议使用默认回调页：https://api.weibo.com/oauth2/default.html
     */
    public static String Sina_Redirect_Url;
    /**
     * WeiboSDKDemo 新浪应用对应的高级权限，第三方开发者一般不需要这么多，可直接设置成空即可。
     * 详情请查看 Demo 中对应的注释。
     */
    public static String Sina_Scope;

    /**
     * 授权认证所需要的信息
     */
    public static AuthInfo mAuthInfo;

    public static void init(Context ctx, boolean isStage) {
        if (isStage) {
            initStage(ctx);
        } else {
            initProduct(ctx);
        }
    }

    /**
     * 初始化测试环境
     *
     * @param ctx
     */
    private static void initStage(Context ctx) {
        // keys
        Wechat_AppId = "wx6ec0228bd605a360";
        Wechat_AppSecret = "e8e090d89cb463de2c2ce0a083c83e10";

        //QQ
        //QQZONE
        QQ_App_Id = "100371290";

        //SINA
        Sina_App_Key = "3847931184";
        Sina_Redirect_Url = "http://demo.qoshop.com/auth/weibo";
        Sina_Scope =
                "email,direct_messages_read,direct_messages_write,"
                        + "friendships_groups_read,friendships_groups_write,statuses_to_me_read,"
                        + "follow_app_official_microblog," + "invitation_write";

        register(ctx);
    }

    /**
     * 初始化正式环境
     *
     * @param ctx
     */
    private static void initProduct(Context ctx) {

        // keys
        Wechat_AppId = "wx6ec0228bd605a360";
        Wechat_AppSecret = "e8e090d89cb463de2c2ce0a083c83e10";

        //QQ
        //QQZONE
        QQ_App_Id = "100371290";

        //SINA
        Sina_App_Key = "3847931184";
        Sina_Redirect_Url = "http://demo.qoshop.com/auth/weibo";
        Sina_Scope =
                "email,direct_messages_read,direct_messages_write,"
                        + "friendships_groups_read,friendships_groups_write,statuses_to_me_read,"
                        + "follow_app_official_microblog," + "invitation_write";

        register(ctx);
    }

    /**
     * 初始化
     *
     * @param ctx
     */
    private static void register(Context ctx) {
        regitsterWechat(ctx);
        regitsterQQAndZone(ctx);
        regitsterSina(ctx);
    }

    /**
     * 注册微信
     *
     * @param ctx
     */
    private static void regitsterWechat(Context ctx) {
        mIwxAPI = WXAPIFactory.createWXAPI(ctx, Wechat_AppId, true);
        mIwxAPI.registerApp(Wechat_AppId);
    }

    /**
     * 注册QQ以及QQ空间
     *
     * @param ctx
     */
    private static void regitsterQQAndZone(Context ctx) {
        mTencentAPI = Tencent.createInstance(QQ_App_Id, ctx);
    }

    /**
     * 注册新浪
     *
     * @param ctx
     */
    private static void regitsterSina(Context ctx) {

        // 创建微博分享接口实例
        mWeiboShareAPI = WeiboShareSDK.createWeiboAPI(ctx, Sina_App_Key);
        // 注册第三方应用到微博客户端中，注册成功后该应用将显示在微博的应用列表中。
        // 但该附件栏集成分享权限需要合作申请，详情请查看 Demo 提示
        // NOTE：请务必提前注册，即界面初始化的时候或是应用程序初始化时，进行注册
        mWeiboShareAPI.registerApp();


        // 创建授权认证信息,第三方微博登录用到
        mAuthInfo = new AuthInfo(ctx, Sina_App_Key, Sina_Redirect_Url, Sina_Scope);
    }

}

