define(function(require, exports, module) {

	exports.initialize = function() {

		var indexView = require("../view/index");

		var mainView = new indexView({
			el : $("#Index_Content")
		});

	};

});
