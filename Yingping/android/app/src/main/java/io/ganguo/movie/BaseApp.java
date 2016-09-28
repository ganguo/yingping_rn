package io.ganguo.movie;

import android.app.Application;

/**
 * Application - 基类
 * <p/>
 * Created by Tony on 9/30/15.
 */
public class BaseApp extends Application {

    private static BaseApp APP;

    /**
     * 单例
     *
     * @return
     */
    public static <T extends BaseApp> T me() {
        return (T) APP;
    }

    /**
     * 应用启动
     */
    @Override
    public void onCreate() {
        super.onCreate();

        APP = this;
    }

    /**
     * 应用销毁
     */
    @Override
    public void onTerminate() {
        super.onTerminate();
    }
}
