define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Scrollview = require('samsara/layouts/Scrollview');

    var Dots = require('./Dots');
    var Arrows = require('./Arrows');

    var Carousel = View.extend({
        defaults: {
            pages: 10
        },
        initialize: function (options) {
            var hue = 0;
            var surfaces = [];
            for (var i = 0; i < options.pages; i++) {
                var surface = new Surface({
                    content: i,
                    classes: ['page'],
                    properties: {
                        background: 'hsl(' + hue + ',80%,50%)'
                    }
                });

                surfaces.push(surface);
                hue += 360 / options.pages;
            }

            var carousel = new Scrollview({
                direction: Scrollview.DIRECTION.X,
                paginated: true,
                pageTransition: {
                    curve: 'spring',
                    period: 100,
                    damping: 0.8
                },
                edgeTransition: {
                    curve: 'spring',
                    period: 100,
                    damping: 1
                }
            });

            carousel.addItems(surfaces);

            var arrows = new Arrows(options.arrows);

            var currentPage = 0;
            arrows.on('next', function () {
                if (currentPage < options.pages - 1)
                    carousel.goTo(++currentPage);
            });

            arrows.on('prev', function () {
                if (currentPage > 0)
                    carousel.goTo(--currentPage);
            });

            var dots = new Dots(options.dots);

            carousel.on('page', function (index) {
                currentPage = index;
                dots.set(index);
            });

            carousel.on('update', function(data){
                (data.index == 0)
                    ? arrows.hideLeft()
                    : arrows.showLeft();

                (data.index == options.pages-1)
                    ? arrows.hideRight()
                    : arrows.showRight();
            });

            this.add(carousel);
            this.add(arrows);
            this.add({align : [.5,.9]}).add(dots);
        }
    });

    module.exports = Carousel;
});
