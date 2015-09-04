/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('samsara/core/Transform');
    var View = require('samsara/core/View');
    var ResizeStream = require('samsara/streams/ResizeStream');
    var LayoutNode = require('samsara/core/nodes/LayoutNode');
    var SizeNode = require('samsara/core/nodes/SizeNode');

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        }
    };

    var SequentialLayout = View.extend({
        defaults : {
            direction : CONSTANTS.DIRECTION.X,
            spacing : 0
        },
        events : {},
        initialize : function initialize(){},
        sequenceFrom : function sequenceFrom(sequence){
            var sizes = [];
            for (var i = 0; i < sequence.length; i++)
                sizes.push(sequence[i].size);

            var transformStream = ResizeStream.lift(function(){
                var sizes = arguments;
                var direction = this.options.direction;
                var transforms = [];

                var displacement = 0;
                for (var i = 0; i < sizes.length; i++){
                    var size = sizes[i];

                    var transform = direction === CONSTANTS.DIRECTION.X
                        ? Transform.translateX(displacement)
                        : Transform.translateY(displacement);

                    transforms.push(transform);

                    displacement += size[direction] + this.options.spacing;
                }

                return transforms;
            }.bind(this), sizes);

            for (var i = 0; i < sequence.length; i++){
                var node = sequence[i];
                var transform = transformStream.pluck(i);
                var layout = new LayoutNode({transform : transform});
                this.add(layout).add(node);
            }
        }
    }, CONSTANTS);

    module.exports = SequentialLayout;
});
