package com.share.api.utils;

import android.content.Context;
import android.util.DisplayMetrics;
import android.util.TypedValue;
import android.view.Gravity;
import android.widget.Toast;


/**
 * Toast 辅助类
 * # UI 安全
 * <p/>
 * Created by Tony on 9/30/15.
 */
public class ToastHelper {

    private static Toast toast;

    /**
     * 弹出Toast消息
     *
     * @param charSequence
     */
    public static void showMessage(final Context context, final CharSequence charSequence) {
        if (toast == null) {
            toast = Toast.makeText(context, charSequence, Toast.LENGTH_SHORT);
        } else {
            toast.setText(charSequence);
        }
        toast.setGravity(Gravity.CENTER_HORIZONTAL | Gravity.BOTTOM, 0, dpToPx(context, 64));
        toast.show();
    }

    /**
     * 弹出Toast消息
     *
     * @param charSequence
     */
    public static void showMessageMiddle(final Context context, final CharSequence charSequence) {
        if (toast == null) {
            toast = Toast.makeText(context, charSequence, Toast.LENGTH_SHORT);
        } else {
            toast.setText(charSequence);
        }
        toast.setGravity(Gravity.CENTER, 0, 0);
        toast.show();
    }

    /**
     * 弹出Toast消息
     *
     * @param resId
     */

    public static void showMessageMiddle(Context context, int resId) {
        showMessageMiddle(context, context.getResources().getText(resId));
    }

    /**
     * 资源ID信息显示
     *
     * @param context
     * @param resId
     */
    public static void showMessage(Context context, int resId) {
        showMessage(context, context.getResources().getText(resId));
    }

    /**
     * 资源ID信息显示
     *
     * @param context
     * @param resId
     * @param duration Toast.LENGTH_SHORT | Toast.LENGTH_LONG
     */
    public static void showMessage(Context context, int resId, int duration) {
        showMessage(context, context.getResources().getText(resId), duration);
    }

    /**
     * 指定消息显示时间
     *
     * @param context
     * @param charSequence
     * @param duration     Toast.LENGTH_SHORT | Toast.LENGTH_LONG
     */
    public static void showMessage(final Context context, final CharSequence charSequence, final int duration) {
        if (toast == null) {
            toast = Toast.makeText(context, charSequence, duration);
        } else {
            toast.setText(charSequence);
        }
        toast.show();
    }

    /**
     * 取消所有toast
     */
    public static void cancel() {
        if (toast != null) {
            toast.cancel();
        }
    }

    /**
     * dp to px
     *
     * @param dp
     * @param context
     * @return
     */
    public static int dpToPx(Context context, float dp) {
        return (int) applyDimension(context, TypedValue.COMPLEX_UNIT_DIP, dp);
    }

    /**
     * 单位转换
     *
     * @param context
     * @param unit    TypedValue.COMPLEX_UNIT_DIP
     * @param value   px
     * @return
     */
    public static float applyDimension(Context context, int unit, float value) {
        DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
        return TypedValue.applyDimension(unit, value, displayMetrics);
    }

}
