define(function (require, exports, module) {

    require("jquery.templates")($);

    var view = Backbone.View.extend({
        initialize: function () {
            this.render();

            var list = require("../collection/datalist");
            var urlArgument = window.context.urlparams || [];

            //#region 绑定商品列表

            (function () {

                var searchModel = this.model;
                var productList = new list();

                //#region 无刷新分页 跳转

                var loging = false;
                searchModel.on("change:page , change:sort , change:cid", function (newModel) {

                    if (loging) return;

                    loging = true;
                    productList.fetch({
                        useCache: true,
                        url: 'http://Goods.goodList->/' + Core.GetSeachParam(newModel),
                        success: function (collection, result) {

                            searchModel.total = result.total;

                            var data = { list: [], total: result.total };

                            collection.forEach(function (model, i) {
                                data.list.push({
                                    gid: model.get("gid"),
                                    title: model.get("title"),
                                    price: model.get("price"),
                                    pic_url: (model.get("pic_url") || "").replace("{0}", "normal")
                                });
                            });

                            $('#productlistContent').setTemplate($('#productItemTemplate').html());
                            $("#totalCount").text(data.total);

                            $('#productlistContent').processTemplate(data, null, { append: true });
                            $("#productlistContent").listview("refresh");

                            loging = false;
                        }

                    });

                });

                //#endregion

                if (urlArgument.length == 8) {
                    this.model.set({
                        key: urlArgument[0], bid: urlArgument[1], cid: urlArgument[2], age: urlArgument[3],
                        price: urlArgument[4], sort: urlArgument[5], page: urlArgument[6], size: urlArgument[7]
                    });
                }
                else {
                    this.model.set({ page: 1 });
                }

                //#region 刷新跳转，地址栏可以保留记录
                /*
                productList.fetch({
                useCache: false,
                url: 'http://Goods.goodList->/' + Core.GetSeachParam(searchModel),
                success: function (collection, result) {

                searchModel.total = result.total;

                var data = { list: [], total: result.total };

                collection.forEach(function (model, i) {
                data.list.push({
                gid: model.get("gid"),
                title: model.get("title"),
                price: model.get("price"),
                pic_url: (model.get("pic_url") || "").replace("{0}", "normal")
                });
                });

                $('#productlistContent').setTemplate($('#productItemTemplate').html());
                $("#totalCount").text(data.total);

                $('#productlistContent').processTemplate(data, null, { append: true });
                $("#productlistContent").listview("refresh");

                }

                });
                */
                //#endregion

            }).apply(this);

            //#endregion

        },
        render: function () {
            var template = Handlebars.compile(require("/templates/productlist.tpl"));
            Core.PageChange(this.el, template);
            Core.RefreshPage();
            return this;
        },
        events: {
            "click #morePage": "morePageFun",
            'click #sales': 'salesFun',
            'click #price': 'priceFun',
            'click #upTime': 'upTimeFun'
        }, morePageFun: function (e) {
            $("#morePage").unbind();
            var total = parseInt(this.model.total);
            var size = parseInt(this.model.get("size"));
            var page = parseInt(this.model.get("page"));
            if ((page) <= (total / size)) {
                this.model.set({ page: page + 1 });
                //Backbone.Router.Redirect("productlist/" + Core.GetSeachParam(this.model));
            }
        }, salesFun: function (e) {
            
        }, priceFun: function (e) {
        }, upTimeFun: function (e) {
        }
    });

    return view;

});