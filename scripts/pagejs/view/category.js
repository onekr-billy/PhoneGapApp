define(function (require, exports, module) {

    require("jquery.templates")($);

    var view = Backbone.View.extend({
        initialize: function () {
            this.render();

            var list = require("../collection/datalist");

            (function () {
                var categoryList = new list();

                var categoryListCallback = function (collection, result) {

                    var data = { list: [] };

                    window.categoryChildData = {};
                    var setCategoryChildData = function (id, child) {
                        categoryChildData[id] = child;
                        if (!_.isEmpty(child)) {
                            _.each(child, function (item, key) {
                                if (!_.isEmpty(item.child))
                                    setCategoryChildData(item.id, item.child);
                            });
                        }
                    };

                    if (!_.isEmpty(collection)) {
                        collection.forEach(function (model, i) {
                            var child = model.get("child");
                            var id = model.get("id");

                            setCategoryChildData(id, child);

                            data.list.push({
                                name: model.get("name"),
                                child: child,
                                id: id
                            });

                        });

                        $('#sub_categoryList').hide();
                        $('#categoryList').show().setTemplate($('#categoryList_template').html());
                        $('#categoryList').processTemplate(data.list, null, { append: false });
                        $("#categoryList").trigger("create");

                    }

                };

                categoryList.fetch({
                    useCache: true,
                    url: 'http://Goods.get_goodscategory_list->',
                    success: categoryListCallback
                });

            }).call(this);

        },
        render: function () {
            var template = Handlebars.compile(require("/templates/category.tpl"));
            Core.PageChange(this.el, template);
            Core.RefreshPage();
            return this;
        },
        events: {
            "click .SubZC ,.cidA": "subCategory"
        },
        subCategory: function (e) {
            var $this = $(e.toElement);

            var id = $this.attr("data-id");
            var child = categoryChildData[id];

            if (_.isEmpty(child)) {
                Backbone.Router.Redirect(Core.SiteUrl.productlist({
                    key: null, bid: 0, cid: id, age: null, price: null, sort: 100, page: 1, size: 10
                }));
            } else {
                Backbone.Router.Redirect("subcategory/" + id);
                $('#categoryList').hide();
                $('#sub_categoryList').show().setTemplate($('#sub_category_template').html());
                $("#sub_categoryList").processTemplate(child, null, { append: false });
                $("#sub_categoryList").listview("refresh");
            }
        }
    });

    return view;

});