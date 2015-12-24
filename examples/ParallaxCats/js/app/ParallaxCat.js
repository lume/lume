define(function(require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Surface = require('samsara/dom/Surface');
    var ContainerSurface = require('samsara/dom/ContainerSurface');

    var ParallaxCat = View.extend({
        defaults : {
            path : '',
            parallaxAmount : 70,
            index : 0,
            skewAngle : 0
        },
        initialize: function (options) {
            var container = new ContainerSurface({
                classes: ['cat'],
                properties: {overflow: 'hidden'}
            });

            var surface = new Surface({
                tagName: 'img',
                attributes: {
                    src: options.path
                },
                origin: [.5, .5],
                proportions: [1.5, 1.5]
            });

            var parallaxTransform = this.input.map(function (data) {
                var offset = options.parallaxAmount * (data.index + data.progress);
                return Transform.translateY(offset)
            });

            container
                .add({
                    transform: Transform.compose(
                        Transform.skewY(options.skewAngle),
                        Transform.translateY(-options.index * options.parallaxAmount)
                    )
                })
                .add({
                    align: [.5, .5],
                    transform: parallaxTransform
                })
                .add(surface);

            this
                .add({transform: Transform.skewY(-options.skewAngle)})
                .add(container);
        }
    });

    module.exports = ParallaxCat;
});
