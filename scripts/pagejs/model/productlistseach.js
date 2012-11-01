
define(function (require, exports, module) {

    var model = Backbone.Model.extend({
        defaults: {
            key: 'null',
            bid: 0,
            cid: 0,
            age: 'null',
            price: 'null',
            sort: '100',
            page: 1,
            size: 10
        }
    });

    return model;

});