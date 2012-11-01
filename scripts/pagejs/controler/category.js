define(function (require, exports, module) {

    exports.initialize = function () {

        var categoryView = require("../view/category");

        var mainView = new categoryView({
            el: $("#Index_Content")
        });

    };

});