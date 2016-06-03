define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Surface = require('samsara/dom/Surface');
    var Transitionable = require('samsara/core/Transitionable');
    var SequentialLayout = require('samsara/layouts/SequentialLayout');

    var Dots = View.extend({
        defaults: {
            spacing : 0,
            diameter : 0,
            numDots : 0,
            fadeIn : false,
            fadeOut : false
        },
        initialize: function (options) {
            // Position of the main dot
            this.position = new Transitionable(0);

            // Opacity of the main dot
            this.opacity = new Transitionable(1);

            // Layout the dots sequentially in the x-direction
            var dotLayout = new SequentialLayout({
                spacing: options.spacing,
                direction : SequentialLayout.DIRECTION.X
            });

            // Create the dots and add to the layout
            for (var i = 0; i < options.numDots; i++){
                var dot = new Surface({
                    size: [options.diameter, options.diameter],
                    classes : ['dot']
                });
                dotLayout.push(dot);
            }

            // Create the main dot
            var mainDot = new Surface({
                size: [options.diameter, options.diameter],
                classes : ['main-dot']
            });

            // Build the render subtree
            this.add(dotLayout);
            this.add({
                transform: this.position.map(function (x) {
                    return Transform.translateX(x);
                }),
                opacity: this.opacity
            }).add(mainDot);
        },
        // Move the active dot with a fadeIn/Out transition
        goTo : function(index){
            var length = this.options.diameter + this.options.spacing;
            this.opacity.set(0, this.options.fadeOut, function () {
                this.position.set(index * length);
                this.opacity.set(1, this.options.fadeIn);
            }.bind(this));
        }
    });

    module.exports = Dots;
});
