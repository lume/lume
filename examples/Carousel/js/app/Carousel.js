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
            // Tracks the current page state
            this.currentPage = 0;

            // Create the arrows, dots and scrollview
            this.createArrows(options.arrows);
            this.createDots(options.dots);
            this.createScrollview(options.scrollview);

            // Create the surfaces with uniformly graded hues
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

                // Add the surface to the carousel
                this.scrollview.push(surface);

                hue += 360 / options.pages;
            }
        },
        createArrows : function(options){
            this.arrows = new Arrows(options);

            // Transition the scrollview to the next page
            this.arrows.on('next', function () {
                if (this.currentPage < this.options.pages - 1)
                    this.scrollview.goTo(++this.currentPage);
            }.bind(this));

            // Transition the scrollview to the previous page
            this.arrows.on('prev', function () {
                if (this.currentPage > 0)
                    this.scrollview.goTo(--this.currentPage);
            }.bind(this));

            // Add the arrows the render subtree
            this.add(this.arrows);
        },
        createScrollview : function(options){
            // Patch the options with necessary defaults
            options = options || {};
            options.direction = Scrollview.DIRECTION.X;
            options.paginated = true;

            this.scrollview = new Scrollview(options);

            // Update the current page in case the user has changed
            // it by scrolling
            this.scrollview.on('page', function (index) {
                this.currentPage = index;
                this.dots.goTo(index);
            }.bind(this));

            // Check if the scrollview is at the beginning or end
            this.scrollview.on('update', function (data) {
                (data.index == 0 && data.progress < .5)
                    ? this.arrows.hideLeft()
                    : this.arrows.showLeft();

                (data.index == this.options.pages - 1 && data.progress > .5)
                    ? this.arrows.hideRight()
                    : this.arrows.showRight();
            }.bind(this));

            this.add(this.scrollview);
        },
        createDots : function(options){
            this.dots = new Dots(options);

            // Calculate the size of the dots
            var N = options.numDots;
            var spacing = options.spacing;
            var diameter = options.diameter;
            var size = [N * diameter + (N - 1) * spacing, diameter];

            // Center and align towards the bottom
            this.add({align: [.5, .9]})
                .add({size: size, origin: [.5, .5]}) // define origin point and size of dots view
                .add(this.dots);
        }
    });

    module.exports = Carousel;
});
