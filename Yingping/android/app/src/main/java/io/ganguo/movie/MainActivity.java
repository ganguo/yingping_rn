package io.ganguo.movie;

import com.facebook.react.ReactActivity;
import com.BV.LinearGradient.LinearGradientPackage;
import io.realm.react.RealmReactPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import io.ganguo.movie.reactPackage.ShareReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Yingping";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new LinearGradientPackage(),
            new RealmReactPackage(),
            new ShareReactPackage()
        );
    }
}
