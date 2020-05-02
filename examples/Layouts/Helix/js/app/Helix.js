define(function(require, exports, module){
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var View = require('samsara/core/View');
    var Scrollview = require('samsara/layouts/Scrollview');
    var Stream = require('samsara/streams/Stream');
    var EmptyNode = require('samsara/core/EmptyNode');

    var Helix = View.extend({
        defaults : {
            spacing: 0,
            N: 20,
            perspective: undefined,
            radius: undefined,
            pitch: undefined,
            perspectiveOrigin: [.5,.5],
            itemProportions: [.8,.8]
        },
        initialize : function(options){
            // Create the layout with options

            var endPosition = Stream.lift(function(proportions, size){
                return proportions[0] * size[0];
            }, [options.itemProportions, this.size]);

            var layout = new Scrollview({
                endPosition : endPosition,
                container : {origin : [.5,0.5]},
                direction : Scrollview.DIRECTION.X,
                spacing : options.spacing,
                enableMouseDrag: true,
                clip: false
            });

            layout.perspectiveFrom(options.perspective);
            layout.perspectiveOriginFrom(options.perspectiveOrigin);

            layout.setLengthMap(function(length, radius, pitch, size, proportions){
                var width = proportions[0] * size[0];
                var index = length / width;
                var angleY = index * 2 * Math.asin(.5 * width / radius);
                var angleSkew = Math.atan2(pitch, width);

                var x = size[0]/2;
                var y = size[1]/2;

                return Transform.composeMany(
                    Transform.translate([x, y + index * pitch, -radius]),
                    Transform.skewY(-angleSkew),
                    Transform.rotateY(angleY),
                    Transform.translateZ(radius),
                    Transform.skewY(angleSkew)
                );
            }, [options.radius, options.pitch, this.size, options.itemProportions]);

            var start = 0;
            var end = 360;
            var step = (end - start) / options.N;
            var hue = start;
            var emoji = 128512;

            for (var i = 0; i < options.N; i++) {
                var color = 'hsla(' + hue + ',50%,50%,.8)';
                hue += step;

                var proportions = new Transitionable([.8,.8]);
                var opacity = new Transitionable(1);

                var surface = new Surface({
                    // proportions: proportions,
                    opacity: opacity,
                    origin : [0, 0.5],
                    content : '&#' + emoji++,
                    classes : ['listItem', 'center'],
                    properties : {
                        background : color,
                        fontSize : '70px'
                    }
                });

                var emptyNode = new EmptyNode({proportions : proportions});
                var translate = endPosition.map(function(value){
                    return Transform.translateX(-0.5 * value);
                });

                emptyNode.add({transform : translate}).add(surface);

                (function(proportions, opacity, node){
                    surface.on('click', function(){
                        proportions.set([0, .8], {duration : 500}, function(){
                            node.remove();
                        });
                        opacity.set(0, {duration : 500});
                    });
                })(proportions, opacity, emptyNode);

                layout.push(emptyNode);
            }

            this.add(layout);
        }
    });

    module.exports = Helix;
});