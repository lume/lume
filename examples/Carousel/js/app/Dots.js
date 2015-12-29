define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Surface = require('samsara/dom/Surface');
    var Transitionable = require('samsara/core/Transitionable');
    var SequentialLayout = require('samsara/layouts/SequentialLayout');

    var Dots = View.extend({
        defaults: {
            spacing : 5,
            diameter : 5,
            numDots : 5
        },
        initialize: function (options) {
            var diameter = options.diameter;
            var spacing = options.spacing;
            var N = options.numDots;
            var size = [N * diameter + (N - 1) * spacing, diameter];

            this.x = new Transitionable(0);
            this.opacity = new Transitionable(1);

            var dotLayout = new SequentialLayout({
                size : size,
                spacing: spacing,
                direction : 0
            });

            var dots = [];
            for (var i = 0; i < options.numDots; i++){
                var dot = new Surface({
                    size: [diameter, diameter],
                    classes : ['dot']
                });

                dots.push(dot);
            }

            var transform = this.x.map(function (x) {
                return Transform.translateX(x);
            });

            var mainDotLayout = {
                transform: transform,
                opacity: this.opacity
            };

            var mainDot = new Surface({
                size: [diameter, diameter],
                classes : ['main-dot']
            });

            dotLayout.addItems(dots);

            var node = this.add({size : size, origin : [.5,.5]});
            node.add(dotLayout);
            node.add(mainDotLayout).add(mainDot);
        },
        set : function(index){
            var length = this.options.diameter + this.options.spacing;
            this.opacity.set(0, {duration: 100}, function () {
                this.x.set(index * length);
                this.opacity.set(1, {duration: 50});
            }.bind(this));
        }
    });

    module.exports = Dots;
});
