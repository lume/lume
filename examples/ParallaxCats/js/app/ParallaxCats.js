define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Scrollview = require('samsara/layouts/Scrollview');

    var ParallaxCat = require('./ParallaxCat');

    var ParallaxCats = View.extend({
        defaults: {
            cats : 8,
            skew : Math.PI/25,
            parallaxAmount : 70
        },
        initialize: function (options) {
            var scrollview = new Scrollview({
                direction: Scrollview.DIRECTION.Y,
                drag: 0.3
            });

            var surfaces = [];
            for (var i = 0; i < options.cats; i++) {
                var parallaxCat = new ParallaxCat({
                    proportions: [1,2/3],
                    skew: options.skew,
                    src: './assets/cat' + (i + 1) + '.jpg',
                    parallaxAmount: options.parallaxAmount,
                    index: i
                });

                parallaxCat.subscribe(scrollview);

                surfaces.push(parallaxCat);
            }

            scrollview.addItems(surfaces);

            this.add(scrollview);
        }
    });

    module.exports = ParallaxCats;
});
