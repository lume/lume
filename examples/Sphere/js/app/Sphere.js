define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');

    // Arrange surfaces into a spherical shape.
    // Emit a `lookAt` event when a surface is clicked and give it the surface's original transform
    var Sphere = View.extend({
        defaults: {
            numRows: 10,        // number of latitude lines
            colSpacing: 0,      // horizontal spacing along a latitude line
            itemSize: [50,50]   // size of individual surfaces
        },
        initialize: function (options) {
            var r = 0.5 * options.size[0];  // radius
            var width = options.itemSize[0];
            var N = options.numRows;
            var spacing = options.colSpacing;

            // Since the sphere is originally centered at [0,0], we translate it to [r, r] so that it
            // is contained inside its view's size [2*r, 2*r]
            var centerTransform = this.add({transform : Transform.translate([r, r, 0])});

            // Iterate along longitude
            for (var i = 0; i < N; i++) {
                var phi = (N === 1) ? 0 : -Math.PI/2 + i * Math.PI / (N - 1);

                // Calculate maximum number of surfaces to be placed on latitude
                var arcRadius = Math.abs(r * Math.cos(phi));
                var numRows = (arcRadius > width)
                    ? Math.ceil(Math.PI / Math.asin((width + spacing) / (2 * arcRadius)))
                    : 1;

                // Iterate along latitude
                for (var j = 0; j < numRows; j++) {
                    var theta = -Math.PI + 2 * j * Math.PI / numRows;

                    // Create transform to rotate the surface by
                    var rotation = Transform.compose(
                        Transform.rotateY(theta),
                        Transform.rotateX(phi)
                    );
                    var transform = Transform.moveThen([0,0,r], rotation);

                    // Create and add the surface
                    var surface = createSurface.call(this, transform);
                    centerTransform.add({transform : transform}).add(surface);
                }
            }
        }
    });

    // Create a surface with a `click` handler to send a `lookAt` event
    // out of the sphere with the surface's transform
    function createSurface(transform){
        var surface = new Surface({
            size : [50,50],
            origin : [.5,.5],
            opacity: .9,
            classes : ['item']
        });

        surface.on('click', function(){
            this.emit('lookAt', transform);
        }.bind(this));

        return surface;
    };

    module.exports = Sphere;
});
