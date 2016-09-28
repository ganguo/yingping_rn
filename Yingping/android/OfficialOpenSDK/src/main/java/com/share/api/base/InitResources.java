package com.share.api.base;

/**
 * 初始化资源
 * <p/>
 * Created by Tony on 9/30/15.
 */
public interface InitResources {

    void beforeInitView();

    void initView();

    void initListener();

    void initData();

}
