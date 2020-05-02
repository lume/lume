define(function(require, exports, module){
    var View = require('samsara/core/View');
    var SequentialLayout = require('samsara/layouts/SequentialLayout');

    var SliderPanel = View.extend({
        defaults : {
            spacing : 0
        },
        initialize : function(options){
            this.layout = new SequentialLayout({
                direction : SequentialLayout.DIRECTION.Y,
                spacing : this.options.spacing
            });
        }
    });

    module.exports = SliderPanel;
});

