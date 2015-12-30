define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Transitionable = require('samsara/core/Transitionable');

    var Arrows = View.extend({
        defaults : {
            leftContent  : '❮',
            rightContent : '❯',
            hideOpacity: 0,
            hideTransition : false,
            showTransition : false
        },
        initialize: function (options) {
            // Opacity of the arrows
            this.leftOpacity = new Transitionable(options.hideOpacity);
            this.rightOpacity = new Transitionable(1);

            // Create the arrow surfaces
            var leftArrow = new Surface({
                content: options.leftContent,
                size: [true, true],
                origin: [0, 0.5],
                classes: ['arrow'],
                opacity: this.leftOpacity
            });

            var rightArrow = new Surface({
                content: options.rightContent,
                size: [true, true],
                origin: [1, 0.5],
                classes: ['arrow'],
                opacity: this.rightOpacity
            });

            // Emit `prev` and `next` events on click
            leftArrow.on('click', function () {
                this.emit('prev');
            }.bind(this));

            rightArrow.on('click', function () {
                this.emit('next');
            }.bind(this));

            // Build the render subtree
            this.add({align: [0, .5]}).add(leftArrow);
            this.add({align: [1, .5]}).add(rightArrow);
        },
        // Fade out the left arrow
        hideLeft: function(transition, callback){
            transition = transition || this.options.hideTransition;
            this.leftOpacity.set(this.options.hideOpacity, transition, callback);
        },
        // Fade out the right arrow
        hideRight: function(transition, callback){
            transition = transition || this.options.hideTransition;
            this.rightOpacity.set(this.options.hideOpacity, transition, callback);
        },
        // Fade in the left arrow
        showLeft: function(transition, callback){
            transition = transition || this.options.showTransition;
            this.leftOpacity.set(1, transition, callback);
        },
        // Fade in the right arrow
        showRight: function (transition, callback) {
            transition = transition || this.options.showTransition;
            this.rightOpacity.set(1, transition, callback);
        }
    });

    module.exports = Arrows;
});
