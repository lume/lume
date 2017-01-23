define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');

    // Define a cube with top, bottom, left, right, front and back sides.
    // The length of the cube is a `Transitionable` which can animate.

    // Note: animating a size is not hardware accelerated, and should be used sparingly
    // It is better to animate size with a scale `Transform` instead
    var Cube = View.extend({
        initialize: function (options) {
            // Add each of the cube's faces
            this.addLeft();
            this.addRight();
            this.addFront();
            this.addBack();
            this.addTop();
            this.addBottom();
        },
        addLeft : function(){
            var left = new Surface({
                content: 'left',
                origin: [.5, .5],
                classes: ['face', 'left']
            });

            this.add({
                align: [.5, .5],
                transform: this.size.map(function(size){
                    return Transform.thenMove(
                        Transform.rotateY(-Math.PI / 2),
                        [-size[0] / 2, 0, 0]
                    );
                })
            }).add(left);
        },
        addRight : function(){
            var right = new Surface({
                content: 'right',
                origin: [.5, .5],
                classes: ['face', 'right']
            });

            this.add({
                align: [.5, .5],
                transform: this.size.map(function(size){
                    return Transform.thenMove(
                        Transform.rotateY(Math.PI / 2),
                        [size[0] / 2, 0, 0]
                    );
                })
            }).add(right);
        },
        addTop : function(){
            var top = new Surface({
                content: 'top',
                origin: [.5, .5],
                classes: ['face', 'top']
            });

            this.add({
                align: [.5, .5],
                transform: this.size.map(function(size){
                    return Transform.thenMove(
                        Transform.rotateX(Math.PI / 2),
                        [0, -size[0] / 2, 0]
                    );
                })
            }).add(top);
        },
        addBottom : function(){
            var bottom = new Surface({
                content: 'bottom',
                origin: [.5, .5],
                classes: ['face', 'bottom']
            });

            this.add({
                align: [.5, .5],
                transform: this.size.map(function(size){
                    return Transform.thenMove(
                        Transform.rotateX(-Math.PI / 2),
                        [0, size[0] / 2, 0]
                    );
                })
            }).add(bottom);
        },
        addFront : function(){
            var front = new Surface({
                content: 'front',
                origin: [.5, .5],
                classes: ['face', 'front']
            });

            this.add({
                align: [.5, .5],
                transform: this.size.map(function(size){
                    return Transform.translateZ(size[0] / 2);
                })
            }).add(front);
        },
        addBack : function(){
            var back = new Surface({
                content: 'back',
                origin: [.5, .5],
                classes: ['face', 'back']
            });

            this.add({
                align: [.5, .5],
                transform: this.size.map(function(size){
                    return Transform.thenMove(
                        Transform.rotateX(Math.PI),
                        [0, 0, -size[0] / 2]
                    );
                })
            }).add(back);
        }
    });

    module.exports = Cube;
});
