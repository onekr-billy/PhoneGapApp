/// <reference path="../seajs/sea.js" />

define(function (require, exports, module) {

    //#region 加载全局js模块

    var $ = require("jquery");
    $.mobile = require("jqm");
    var backbone = require("backbone");
    var handlebars = require("handlebars");
    var _ = require("underscore");

    require("backbone-modelbinder");
    require("backbone-validation");
    require("backbone-routefilter");
    require("backbone-localstorage");
    var webconfig = require("webconfig");
    var core = require("corejs");

    window.context = {
        router: {},
        views: {},
        models: {},
        collections: {}
    };

    window.$ = $;
    window.jQuery = $;
    window.Backbone = backbone;
    window._ = _;
    window.Handlebars = handlebars;
    window.Core = core;
    window.Config = webconfig;

    //#endregion

    //#region 全局模块、插件初始化，设置
    //
    Backbone.Validation.configure({
        forceUpdate: true
    });

    //加入缓存控制
    // options.useCache = true | false 来启用或禁用缓存，该选项只对 GET 有效
    Backbone.sync = function (method, model, options) {
        var methodMap = {
            'create': 'POST',
            'update': 'PUT',
            'delete': 'DELETE',
            'read': 'GET'
        };
        var type = methodMap[method];

        // Default options, unless specified.
        options || (options = {});

        // Default JSON-request options.
        var params = { type: type, dataType: 'json' };

        // Ensure that we have a URL.
        if (!options.url) {
            params.url = getValue(model, 'url') || urlError();
        }

        // Ensure that we have the appropriate request data.
        if (!options.data && model && (method == 'create' || method == 'update')) {
            params.contentType = 'application/json';
            params.data = JSON.stringify(model.toJSON());
        }

        // For older servers, emulate JSON by encoding the request into an HTML-form.
        if (Backbone.emulateJSON) {
            params.contentType = 'application/x-www-form-urlencoded';
            params.data = params.data ? { model: params.data} : {};
        }

        // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
        // And an `X-HTTP-Method-Override` header.
        if (Backbone.emulateHTTP) {
            if (type === 'PUT' || type === 'DELETE') {
                if (Backbone.emulateJSON) params.data._method = type;
                params.type = 'POST';
                params.beforeSend = function (xhr) {
                    xhr.setRequestHeader('X-HTTP-Method-Override', type);
                };
            }
        }

        // Don't process data on a non-GET request.
        if (params.type !== 'GET' && !Backbone.emulateJSON) {
            params.processData = false;
        }

        var cacheKey = "ajax_{0}_{1}_{2}_{3}".format([params.type, options.url, Core.WcfAuth, JSON.stringify(options.data)]);

        if (options.useCache && UseLocalStorage && params.type == 'GET') {
            if (!_.isUndefined(window.localStorage)) {
                var cacheResult = localStorage.getItem(cacheKey);
                if (!_.isEmpty(cacheResult)) {
                    options.success.call(window, JSON.parse(cacheResult));
                    return;
                }
            }
        }

        //自定义的 
        var mySuccess = function (result, textStatus, jqXhr) {

            if (UseLocalStorage)
                if (!_.isUndefined(window.localStorage))
                    localStorage.setItem(cacheKey, JSON.stringify(result));

            options.success.call(window, result, textStatus, jqXhr);

        };

        // Make the request, allowing the user to override any Ajax options.
        return $.ajax(_.extend(params, options, { success: mySuccess }));
    };

    //设置ajax过滤器
    $.ajaxPrefilter(function (options, originalOptions, jqXhr) {

        var newApiRouter = [];

        if (options.url.indexOf("http://") > -1 && options.url.indexOf("->") > -1) {

            var urlSplit = (options.url || "").replace("http://", "").split("->");

            if (!_.isEmpty(urlSplit)) {
                var apiName = urlSplit[0];
                var apiParam = urlSplit[1];
                var apiRoute = Config.Restful[apiName];
                if (!_.isEmpty(apiRoute)) {
                    newApiRouter.push(Config.WcfRoot);
                    newApiRouter.push(apiRoute);
                    newApiRouter.push(Core.WcfAuth());
                    newApiRouter.push(apiParam);
                    options.url = newApiRouter.join('');
                } else {
                    Log.instance("wcfapi 错误").error(apiName).end();
                }
            }
        }

        return "jsonp";

    });

    //jquery mobile 设置
    $.extend($.mobile, {
        //defaultPageTransition: "slide", //转场默认效果，设置 NONE 为 没有转场动画
        loadingMessage: false, //页面加载显示的 文字，false 为不显示
        pageLoadErrorMessage: "数据异常，请重试...", //Ajax 加载出错显示信息
        autoInitializePage: false, //默认渲染 页面 控件，否则手动调用 $.mobile.initializePage()
        ajaxEnabled: false,
        hashListeningEnabled: false,
        linkBindingEnabled: false,
        pushStateEnabled: false
    });
    $.extend($.mobile.changePage.defaults, {
        allowSamePageTransition: true
    });

    $.mobile.initializePage();
    $(document.body).show(300);

    //#endregion

    //#region 路由配置
    var appRouter = Backbone.Router.extend({
        initialize: function () {
            backbone.history.start({
                pushState: false
            });
        },
        routes: {
            '': 'index',
            'index': 'index',
            'login': 'login',
            'login/:url': 'login',
            'register': 'register',
            'notice/:id': 'notice',
            'category': 'category',
            'category/:id': 'category',
            'subcategory': 'category',
            'subcategory/:id': 'category',
            'productlist': 'productlist',
            'productlist/:key/:bid/:cid/:age/:price/:sort/:page/:size': 'productlist',
            'usercenter': 'usercenter'
        },
        before: function (route, name, args) {
            window.context["urlparams"] = args;
            var pageJsUrl = "../pagejs/controler/" + name;
            require.async(pageJsUrl, function (page) {
                page.initialize();
            });

            return false;
        },
        after: function (route, args) {
        }
    });

    window.context.router = new appRouter();

    //#endregion

    //#region 自定义方法

    //路由自定义方法
    _.extend(backbone.Router, {
        Redirect: function (url) {
            window.context.router.navigate(url, {
                trigger: true
            });
        }
    });

    //#endregion

});
