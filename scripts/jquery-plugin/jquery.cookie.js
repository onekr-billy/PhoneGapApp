/*!
* jQuery Cookie Plugin
* https://github.com/carhartl/jquery-cookie
*
* Copyright 2011, Klaus Hartl
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://www.opensource.org/licenses/mit-license.php
* http://www.opensource.org/licenses/GPL-2.0
*/
define(function () {
    return function ($) {

        $.cookie = function (key, value, options) {

            // key and at least value given, set cookie...
            if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
                options = $.extend({}, options);

                if (value === null || value === undefined) {
                    options.expires = -1;
                }
                if (options.expires == null) {
                    options.expires = 30; //Ĭ��30����
                }

                if (typeof options.expires === 'number') {

                    //var days = options.expires, t = options.expires = new Date();
                    //t.setDate(t.getDate() + days);
                    var data = new Date();

                    data.setTime(data.getTime() + (options.expires * 60 * 1000));
                    options.expires = data;

                }

                value = String(value);

                var cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                '; path=/',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join('');
                return (document.cookie = cookie);
            }

            // key and possibly options given, get cookie...
            options = value || {};
            var decode = options.raw ? function (s) { return s; } : decodeURIComponent;

            var pairs = document.cookie.split('; ');
            for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
                if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
            }
            return null;
        };

        return $;

    };
});
