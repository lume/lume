define(function(require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Surface = require('samsara/dom/Surface');
    var ContainerSurface = require('samsara/dom/ContainerSurface');

    // ParallaxCat is a single image in the ParallaxCats scrollview
    // It listens to the scrollview's progress and translates accordingly
    // to create a parallax effect
    var ParallaxCat = View.extend({
        defaults : {
            src : '',
            parallaxAmount : 70,
            index : 0,
            skew : 0
        },
        initialize: function (options) {
            // Each cat image is placed inside a container with
            // `overflow : hidden` to clip the content
            var container = new ContainerSurface({
                classes: ['cat'],
                properties: {overflow: 'hidden'}
            });

            // Create the cat photo
            var cat = new Surface({
                size: function(parentSize){
                    return [parentSize[0], 4/3 * parentSize[1]];
                },
                tagName : 'img',
                origin : [0.5,0.2],
                attributes : {src : options.src}
            });

            // Transform the image inside of the container by
            // mapping the input (provided by the scrollview) to a translation
            var parallaxTransform = this.input.map(function (data) {
                var offset = options.parallaxAmount * (data.index + data.progress);
                return Transform.translateY(offset)
            });

            // Build the render subtree inside the container
            container
                .add({
                    align : [.5, 0.2],
                    transform: Transform.compose(
                        Transform.translateY(-options.index * options.parallaxAmount),
                        Transform.skewY(options.skew)
                    )
                })
                .add({
                    transform: parallaxTransform
                })
                .add(cat);

            // Build the render subtree for the view
            this
                .add({transform: Transform.skewY(-options.skew)})
                .add(container);
        }
    });

    module.exports = ParallaxCat;
});
