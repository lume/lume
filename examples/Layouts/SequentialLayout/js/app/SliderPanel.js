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
                spacing : options.spacing,
                offset : 0
            });

            this.add(this.layout);
        },
        push : function(slider){
            this.layout.push(slider);
        }
    });

    module.exports = SliderPanel;
});

