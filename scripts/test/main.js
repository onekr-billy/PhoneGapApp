define(function(require, exports, module) {

	var qunit = require('qunit');
	_.extend(window, qunit);
	
	//http://api.qunitjs.com/

	var core = require('../test/core');

	test("test1", function() {
		var a = 1;
		equal(a, "1");

	});

	test("test1.1", function() {
		var a = 1;
		equal(a, "2");
	});

});
