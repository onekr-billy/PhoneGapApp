define(function (require, exports, module) {

    var view = Backbone.View.extend({
        initialize: function () {
            this.render();
        },
        render: function () {
            var template = Handlebars.compile(require("/templates/login.tpl"));
            Core.PageChange(this.el, template);
            Core.RefreshPage();

            Backbone.Validation.bind(this, {
                valid: function (view, attr, selector) {
                    view.$el.find("#" + attr + "Tip").empty().show();
                },
                invalid: function (view, attr, error, selector) {
                    view.$el.find("#" + attr + "Tip").text(error).show();
                }
            });

            var modelBinder = new Backbone.ModelBinder();
            modelBinder.bind(this.model, this.el);
            return this;
        },
        close: function () {
            this.remove();
            this.unbind();
            Backbone.ModelBinder.unbind();
        },
        events: {
            "click #btnLoginSubmit": "submigLogin"
        },
        submigLogin: function (e) {
            e.preventDefault();

            Backbone.sync("update", this.model, {
                url: 'http://Member.Login->',
                success: function (result) {
                    if (json.status == 1 && typeof (json.data) == "string" && json.data.length > 0) {
                        UpdateLoginCookie(json.info, email, json.data);
                        var returnurl = (window.context.urlparams[0] || "").split('#');
                        if (returnurl.length > 0) {
                            Backbone.Router.Redirect(returnurl[1]);
                        }

                    } else
                        this.$("#login_ErroMesg").css("display", "block").text(json.msg);
                }
            });
        }
    });

    return view;

});
