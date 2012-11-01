define(function (require, exports, module) {

    var model = Backbone.Model.extend({
        defaults: {
            email: '',
            password: ''
        },
        initialize: function () {

        },
        validation: {
            email: [{
                required: true,
                msg: '请输入Email地址'
            }, {
                pattern: 'email',
                msg: '请输入正确的email地址'
            }],
            password: [{
                required: true,
                msg: '请输入密码'
            }, {
                rangeLength: [6, 20],
                msg: '密码长度在 6-20 之间'
            }]
        },
        labels: {
            email: "emailTip",
            password: "passwordTip"
        }
    });

    return model;

});
