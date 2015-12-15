define(function(require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Surface = require('samsara/dom/Surface');
    var ContainerSurface = require('samsara/dom/ContainerSurface');

    // A wedge is a angular section of a circle. It's created
    // by placing a circle centered at the lower left corner
    // of a containing `<div>`, shearing the containing `<div>`
    // to the desired angle, and applying the inverse shear to
    // the circle.
    var Wedge = View.extend({
        defaults : {
            angle : 0
        },
        initialize : function(options){
            // Containing surface to apply skew to.
            var skewedContainer = new ContainerSurface({
                proportions : [1/3, false], // the width is a third the parent width, the height unspecified
                aspectRatio : 1,            // sets the height to be equal to the width
                properties : {
                    overflow : 'hidden',
                    border: '1px solid transparent',
                    pointerEvents: 'none'
                }
            });

            // A circle to apply inverse skew to
            // More accurately, it's an annulus with
            // thickness equal to the border radius.
            var wedge = new Surface({
                origin : [.5,.5],           // place the center of the circle at (0,0)
                properties : {
                    borderRadius : '50%',
                    borderColor : 'rgba(255,255,255,0.9)',
                    borderStyle : 'solid'
                }
            });

            // When the wedge resizes, change the border proportionally.
            wedge.on('resize', function(size){
                wedge.setProperties({
                    borderWidth : Math.round(size[0]/3) + 'px'
                })
            });

            // Spinning animation mapped from the swivel transitionable.
            // Experiment here! It's fun and you won't break anything.
            var crazySpinningTransform = this.input.map(function(swivel){
                return Transform.composeMany(
                    Transform.rotateZ(   2 * swivel),
                    Transform.rotateX( 1.5 * swivel),
                    Transform.rotateY(  -2 * swivel),
                    Transform.rotateX(-0.5 * swivel)
                );
            });

            // Angle to skew the container and circle.
            var skewAngle = Math.PI/2 - options.angle;

            // Transform for the container
            var skew = Transform.skewX(skewAngle);

            // Transform for the circle.
            var antiSkew = Transform.skewX(-skewAngle);

            // Add the wedge to the container's inner render tree.
            skewedContainer.add({transform : antiSkew}).add(wedge);

            // Add the container to the render tree with an animating layout.
            this.add({transform : skew})
                .add({transform : crazySpinningTransform})
                .add(skewedContainer);
        }
    });

    module.exports = Wedge;
});
