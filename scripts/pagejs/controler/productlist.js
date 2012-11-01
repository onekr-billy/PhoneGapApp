define(function (require, exports, module) {

    exports.initialize = function () {

        var productlistView = require("../view/productlist");
        var plistSeachModel = require("../model/productlistseach");

        var mainView = new productlistView({
            el: $("#Index_Content"),
            model: new plistSeachModel()
        });

    };


});