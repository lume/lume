define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var Wedge = require('./Wedge');

    var App = View.extend({
        defaults: {
            sides: 6
        },
        initialize: function (options) {
            // Animation parameter
            this.swivel = new Transitionable(0);

            var centerNode = this.add({align : [.5,.5]});

            // Create wedges to form the logo.
            var rotation = 0;
            for (var index = 0; index < options.sides; index++) {
                var wedge = new Wedge({
                    angle: 2 * Math.PI / options.sides
                });

                // The wedge now listens to changes in swivel
                wedge.input.subscribe(this.swivel);

                // Add the wedge to the render tree with a rotation
                centerNode
                    .add({transform: Transform.rotateZ(rotation)})
                    .add(wedge);

                rotation += 2 * Math.PI / options.sides;
            }
        },
        loop : function(){
            this.swivel.loop([
                {
                    value: 4 * Math.PI,
                    transition: {
                        duration: 30000,
                        curve: 'easeInOut'
                    }
                },
                {
                    value: 0,
                    transition: {
                        duration: 30000,
                        curve: 'easeInOut'
                    }
                }
            ]);
        }
    });

    module.exports = App;
});
