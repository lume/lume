define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');

    var Arrows = View.extend({
        defaults : {
            leftContent  : '❮',
            rightContent : '❯'
        },
        initialize: function (options) {
            var leftArrow = new Surface({
                content: options.leftContent,
                size: [true, true],
                origin: [0, 0.5],
                classes: ['arrow']
            });

            var rightArrow = new Surface({
                content: options.rightContent,
                size: [true, true],
                origin: [1, 0.5],
                classes: ['arrow']
            });

            leftArrow.on('click', function () {
                this.emit('prev');
            }.bind(this));

            rightArrow.on('click', function () {
                this.emit('next')
            }.bind(this));

            this.add({align: [0, .5]}).add(leftArrow);
            this.add({align: [1, .5]}).add(rightArrow);
        }
    });

    module.exports = Arrows;
});
