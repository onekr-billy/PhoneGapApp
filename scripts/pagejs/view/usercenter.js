define(function (require, exports, module) {

    require("jquery.templates")($);

    var view = Backbone.View.extend({
        initialize: function () {
            this.render();

            this.model.fetch({
                useCache: true,
                url: 'http://Member.GetInfo->',
                success: function (model, result) {
                    var data = {
                        status: model.get("status"),
                        info: model.get("info")
                    };

                    if (data.status == 1 && _.isObject(data.info)) {
                        data.info.created = Core.WcfDateToJsDate(data.info.created);
                        $('#myAccount_content').setTemplate($('#myAccount_Template').html());
                        $('#myAccount_content').processTemplate(data.info, null, { append: false });
                        $("#myAccount_content").listview("refresh");
                    }
                }
            });
        },
        render: function () {
            var template = Handlebars.compile(require("/templates/usercenter.tpl"));
            Core.PageChange(this.el, template);
            Core.RefreshPage();
            return this;
        }, events: {
            "click #logout": 'logoutFun'
        }, logoutFun: function () {
            Backbone.sync("PUT", null, {
                url: 'http://Member.logout->',
                success: function (result) {
                    if (result.status == 1) {
                        Core.RemoveLoginCookie();
                        Backbone.Router.Redirect("index");
                    }
                }
            });
            //Member.logout
        }
    });

    return view;

});