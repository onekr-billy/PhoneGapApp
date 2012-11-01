define(function (require, exports, module) {

    require("jquery.templates")($);

    var view = Backbone.View.extend({
        initialize: function () {
            this.render();

            var noticeid = (window.context.urlparams[0] || "null");
            this.model.fetch({
                useCache: true,
                url: 'http://Cms.get_notice_info->/' + noticeid,
                success: function (model, resp) {
                    var data = {
                        status: model.get("status"),
                        info: model.get("info")
                    };
                    
                    if (data.status == 1 && _.isObject(data.info)) {
                        data.info.created = Core.WcfDateToJsDate(data.info.created);
                        $('#noticedetailContent').setTemplate($('#notice_detail_jTemplate').html());
                        $('#noticedetailContent').processTemplate(data.info, null, { append: false });
                        $("#noticedetailContent").trigger("create");
                    }
                }
            });
        },
        render: function () {
            var template = Handlebars.compile(require("/templates/notice.tpl"));
            Core.PageChange(this.el, template);
            Core.RefreshPage();
            return this;
        }
    });

    return view;

});