define(function(require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Surface = require('samsara/dom/Surface');
    var ContainerSurface = require('samsara/dom/ContainerSurface');

    var ParallaxCat = View.extend({
        defaults : {
            path : '',
            offset : 0
        },
        initialize: function (options) {
            var shift = 50;
            var angle = Math.PI / 25;

            var container = new ContainerSurface({
                properties: {
                    overflow: 'hidden',
                    border: '2px solid black'
                }
            });

            var surface = new Surface({
                tagName: 'img',
                attributes: {
                    src: options.path
                },
                origin: [.5, .5],
                proportions: [1.25, 1.25]
            });

            var transform = this.input.map(function (data) {
                var offset = shift * (data.index + data.progress);
                return Transform.translateY(offset)
            });

            container
                .add({
                    transform: Transform.compose(
                        Transform.skewY(angle),
                        Transform.translateY(options.offset)
                    )
                })
                .add({
                    align: [.5, .5],
                    transform: transform
                })
                .add(surface);

            this
                .add({transform: Transform.skewY(-angle)})
                .add(container);
        }
    });

    module.exports = ParallaxCat;
});
