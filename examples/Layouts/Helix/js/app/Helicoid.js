define(function(require, exports, module){
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var View = require('samsara/core/View');
    var Scrollview = require('samsara/layouts/Scrollview');
    var Stream = require('samsara/streams/Stream');

    var Helicoid = View.extend({
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
                direction : Scrollview.DIRECTION.Y,
                spacing : options.spacing,
                enableMouseDrag: true,
                clip: false
            });

            layout.perspectiveFrom(options.perspective);
            layout.perspectiveOriginFrom(options.perspectiveOrigin);

            var width = 100;
            var height = 100;
            var angleX = Math.PI/4;
            var angleY = Math.PI/3;
            var angleZ = Math.PI/4;
            var skewAngle = Math.PI/2 - angleZ;
            // var pitch = 2 * Math.PI / angleY * height;// number of pixels for full twist

            layout.setLengthMap(function(length, radius, pitch, size, proportions){
                var x = size[0]/2;
                var y = size[1]/2;

                var index = length / height;
                var dir = (index % 2) === 0 ? -1 : 1;

                return Transform.composeMany(
                    Transform.translate([x, y, 0]),
                    Transform.rotateZ(index * angleZ),
                    Transform.skewX(skewAngle)
                    // Transform.rotateY(angleY)
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

                var surface = new Surface({
                    size: [width, height],
                    origin : [0, 0],
                    // content : '&#' + emoji++,
                    classes : ['listItem', 'center'],
                    properties : {
                        background : color,
                        fontSize : '70px'
                    }
                });

                (function(proportions){
                    surface.on('click', function(){
                        proportions.set([0, .8], {duration : 500}, function(){
                            surface.remove();
                        });
                    });
                })(proportions);

                layout.push(surface);
            }

            this.add(layout);
        }
    });

    module.exports = Helicoid;
});