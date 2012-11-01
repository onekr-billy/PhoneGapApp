define(function (require, exports, module) {

    exports.initialize = function () {
        
        var datainfoModel = require("../model/datainfo");
        var noticeView = require("../view/notice");
        
        var mainView = new noticeView({
            el: $("#Index_Content"),
            model: new datainfoModel()
        });
        
    };

});