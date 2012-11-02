/// <reference path="../seajs/sea.js" />

define(function() {

	seajs.config({
		base : './scripts/',
		charset : 'utf-8',
		debug : 2, //0  --  普通状态 1  --  调试状态 2  --  无缓存状态
		alias : {
			'webconfig' : 'configs/web.config',
			'pagejs' : 'pagejs/mobile.page',
			'corejs' : 'pagejs/mobile.core',

			'md5' : 'plugin/md5',
			'json2' : 'plugin/json2',
			'$' : 'seajs/modules/jquery/1.7.2/jquery-debug',
			'jquery' : 'seajs/modules/jquery/1.7.2/jquery-debug',
			//'jqm': 'jquerymobile/jquery.mobile-1.1.0.min',
			'jqm' : 'seajs/modules/jquerymobile/jqm1.1.0',
			'underscore' : 'seajs/modules/underscore/1.3.3/underscore-debug',
			'backbone' : 'seajs/modules/backbone/0.9.2/backbone-debug',
			'handlebars' : 'seajs/modules/handlebars/1.0.0/handlebars.js',
			'qunit':'seajs/modules/qunit/qunit',
			'test':'test/main',

			'backbone-modelbinder' : 'seajs/modules/backbonemodelbinder/backbone-modelbinder.js',
			'backbone-validation' : 'seajs/modules/backbonevalidation/backbone-validation-amd.js',
			'backbone-routefilter' : 'seajs/modules/backbone/plugin/backbone.routefilter',
			'backbone-localstorage' : 'seajs/modules/backbone/plugin/backbone.localstorage',

			'cookie' : 'seajs/modules/cookie/1.0.2/cookie-debug',
			'jquery.validate' : 'jquery-plugin/jquery.validate.min',
			'jquery.templates' : 'jquery-plugin/jquery-jtemplates_uncompressed'
		},
		preload : ['seajs/plugin-json', 'seajs/plugin-text']
	});

	seajs.use("configs/seajs.web.init");

});
