define(function (require, exports, module) {

    exports.initialize = function () {

        var datainfoModel = require("../model/datainfo");
        var userCenterView = require("../view/usercenter");

        var mainView = new userCenterView({
            el: $("#Index_Content"),
            model: new datainfoModel()
        });

    };

});