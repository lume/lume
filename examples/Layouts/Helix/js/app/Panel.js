define(function(require, exports, module){
    var View = require('samsara/core/View');
    var SequentialLayout = require('samsara/layouts/SequentialLayout');

    var Panel = View.extend({
        defaults : {
            spacing : 0
        },
        initialize : function(options){
            this.sequence = new SequentialLayout({
                origin : [.5,.0],
                direction : SequentialLayout.DIRECTION.Y,
                spacing : this.options.spacing
            });

            this.add({align : [.5,0]}).add(this.sequence);
        },
        push : function(item){
            this.sequence.push(item);
        }
    });

    module.exports = Panel;
});

