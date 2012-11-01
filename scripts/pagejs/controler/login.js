define(function (require, exports, module) {

    exports.initialize = function () {

        var loginModel = require("../model/login");
        var loginView = require("../view/login");

        var mainView = new loginView({
            el: $("#Index_Content"),
            model: new loginModel()
        });

    };

});
