define(function (require, exports, module) {

    var camera = require("../../jquery-plugin/camera")($);
    require("../../jquery-plugin/jquery.easing.1.3");
    require("jquery.templates")($);

    var view = Backbone.View.extend({
        initialize: function () {
            this.render();

            var list = require("../collection/datalist");

            //#region 首页动画
            (function () {
                var collectionA1 = new list();

                var fetchSuccessA1 = function (collection, result) {

                    var domArray = [];
                    collection.forEach(function (model, i) {
                        domArray.push('<div data-src="' + model.get("pic_url") + '" data-link="/goodstopic.aspx?id=' + model.get("id") + '"></div>');
                    });

                    if (this.$.trim(this.$('#foucsPic').html()).length == 0) {

                        this.$('#foucsPic').html(domArray.join(''));
                        camera.camera();
                        camera.cameraStop();
                        camera.cameraPause();
                        camera.cameraResume();
                        this.$('#foucsPic').camera({
                            thumbnails: false,
                            pauseOnClick: false,
                            pagination: false,
                            loader: 'bar',
                            fx: 'scrollHorz',
                            playPause: false,
                            time: 4000,
                            transPeriod: 1500
                        });
                    }
                };

                collectionA1.fetch({
                    useCache: true,
                    url: 'http://Cms.get_columndata_list->/B-A1-A1/1/5',
                    success: fetchSuccessA1
                });

            })();
            //#endregion

            //#region 产品推荐列表
            (function () {
                var collectionA2 = new list();
                var fetchSuccessA2 = function (collection, result) {

                    var data = {};
                    data.list = [];
                    collection.forEach(function (model, i) {
                        data.list.push({
                            id: model.get("id"),
                            title: model.get("title")
                        });
                    });

                    if (data.list.length > 0) {
                        this.$('#columnlistContent').setTemplate(this.$('#columnlist_jTemplate').html());
                        this.$('#columnlistContent').processTemplate(data, null, {
                            append: false
                        });
                        this.$("#columnlistContent").listview("refresh");
                    } else {
                        this.$('#columnlistContent').setTemplate("<li>暂时无公告列表！</li>");
                        this.$('#columnlistContent').processTemplate(data, null, {
                            append: false
                        });
                        this.$("#columnlistContent").listview("refresh");
                    }

                };

                collectionA2.fetch({
                    useCache: true,
                    url: 'http://Cms.get_columndata_list->/B-A1-A2/1/5',
                    success: fetchSuccessA2
                });

            })();
            //#endregion

            //#region 公告列表
            (function () {
                var collectionA3 = new list();

                var fetchSuccessA3 = function (collection, result) {

                    var data = {};
                    data.list = [];
                    collection.forEach(function (model, i) {
                        data.list.push({
                            id: model.get("id"),
                            title: model.get("title")
                        });
                    });

                    if (data.list.length > 0) {
                        $('#noticelistContent').setTemplate($('#notice_jTemplate').html());
                        $('#noticelistContent').processTemplate(data, null, {
                            append: false
                        });
                        $("#noticelistContent").listview("refresh");
                    } else {
                        $('#noticelistContent').setTemplate("<li>暂时无公告列表！</li>");
                        $('#noticelistContent').processTemplate(data, null, {
                            append: false
                        });
                        $("#noticelistContent").listview("refresh");
                    }

                };

                collectionA3.fetch({
                    useCache: true,
                    url: 'http://Cms.get_notice_list->/1/5',
                    success: fetchSuccessA3
                });

            })();
            //#endregion

        },
        render: function () {
            var template = Handlebars.compile(require("/templates/index.tpl"));
            Core.PageChange(this.el, template);
            Core.RefreshPage();
            return this;
        },
        close: function () {
            this.remove();
        },
        events: {
            "keyup #searchinput1": "searchinput"
        },
        searchinput: function (e) {
            if (e.keyCode == 13) {
                var keyval = this.$("#searchinput1").val();
                if (keyval.length > 0) {
                    Backbone.Router.Redirect("productlist/" + keyval);
                }
                return false;
            }
        }
    });

    return view;

});
