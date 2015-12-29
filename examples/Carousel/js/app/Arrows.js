define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Transitionable = require('samsara/core/Transitionable');

    var Arrows = View.extend({
        defaults : {
            leftContent  : '❮',
            rightContent : '❯'
        },
        initialize: function (options) {
            this.leftOpacity = new Transitionable(.2);
            this.rightOpacity = new Transitionable(1);

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

            leftArrow.on('click', function () {
                this.emit('prev');
            }.bind(this));

            rightArrow.on('click', function () {
                this.emit('next')
            }.bind(this));

            this.add({align: [0, .5]}).add(leftArrow);
            this.add({align: [1, .5]}).add(rightArrow);
        },
        hideLeft: function(transition, callback){
            transition = transition || {duration : 50};
            this.leftOpacity.set(.2, transition, callback);
        },
        hideRight: function(transition, callback){
            transition = transition || {duration: 50};
            this.rightOpacity.set(.2, transition, callback);
        },
        showLeft: function(transition, callback){
            transition = transition || {duration: 50};
            this.leftOpacity.set(1, transition, callback);
        },
        showRight: function (transition, callback) {
            transition = transition || {duration: 50};
            this.rightOpacity.set(1, transition, callback);
        }
    });

    module.exports = Arrows;
});
