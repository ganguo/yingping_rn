package io.ganguo.movie;

import com.share.api.GGOfficiialSDK;

/**
 * App 上下文环境
 * <p/>
 * Created by Tony on 9/30/15.
 */
public class AppContext extends BaseApp {

    @Override
    public void onCreate() {
        super.onCreate();

        GGOfficiialSDK.init(this, true);
    }
}
