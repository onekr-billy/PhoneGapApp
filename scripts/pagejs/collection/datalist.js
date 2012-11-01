define(function (require, exports, module) {

    var collection = Backbone.Collection.extend({
        //url : function() {
        //	//return 'http://api.muyingzhijia.me/cms.svc/get_columndata_list/WebSite/token/guid/654/uid/B-A1-A1/1/5';
        //},
        //localStorage: new Backbone.LocalStorage("columnA1Collection"),
        //model : columnModel,
        parse: function (result, xhr) {

            if (_.isObject(result)) {
                if (_.isNumber(result.status) && result.status == 1) {
                    if (_.isArray(result.list)) {
                        return result.list;
                    } else if (_.isArray(result.info)) {
                        return result.info;
                    } else {
                        return [];
                    }
                }
            }
            return [];
        }
    });
    return collection;

});
