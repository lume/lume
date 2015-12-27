define(function (require, exports, module) {
    var View = require('samsara/core/View');

    var CrossFader = View.extend({
        // Executed on instantiation. Options are patched by the defaults if unspecified.
        initialize: function () {
            this.fadeIn = this.input.map(function (data) {
                return Math.pow(1 - data.progress, 4);
            });

            this.fadeOut = this.input.map(function (data) {
                return data.progress;
            });
        },
        addFront: function(obj){
            this.add({opacity : this.fadeIn}).add(obj);
        },
        addBack: function(obj){
            this.add({opacity : this.fadeOut}).add(obj);
        }
    });

    module.exports = CrossFader;
});