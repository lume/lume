define(function(require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Surface = require('samsara/dom/Surface');
    var ContainerSurface = require('samsara/dom/ContainerSurface');

    var ParallaxCat = View.extend({
        defaults : {
            src : '',
            parallaxAmount : 70,
            index : 0,
            skew : 0
        },
        initialize: function (options) {
            var container = new ContainerSurface({
                classes: ['cat'],
                properties: {overflow: 'hidden'}
            });

            var cat = new Surface({
                properties: {
                    backgroundImage: 'url(' + options.src + ')',
                    backgroundSize: 'cover'
                },
                origin: [.5, .5],
                proportions: [1.3, 1.3]
            });

            var parallaxTransform = this.input.map(function (data) {
                var offset = options.parallaxAmount * (data.index + data.progress);
                return Transform.translateY(offset)
            });

            container
                .add({
                    transform: Transform.compose(
                        Transform.skewY(options.skew),
                        Transform.translateY(-options.index * options.parallaxAmount)
                    )
                })
                .add({
                    align: [.5, .5],
                    transform: parallaxTransform
                })
                .add(cat);

            this
                .add({transform: Transform.skewY(-options.skew)})
                .add(container);
        }
    });

    module.exports = ParallaxCat;
});
