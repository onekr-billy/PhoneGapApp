$(document).bind("mobileinit", function () {
    //设置jquerymobile 默认设置
    $.extend($.mobile, {
        defaultPageTransition: "slide", //转场默认效果，设置 NONE 为 没有转场动画
        loadingMessage: false, //页面加载显示的 文字，false 为不显示
        pageLoadErrorMessage: "数据异常，请重试...", //Ajax 加载出错显示信息
        autoInitializePage: false, //默认渲染 页面 控件，否则手动调用 $.mobile.initializePage()
        ajaxEnabled: true,
        linkBindingEnabled: false,
        pushStateEnabled: true
    });
});