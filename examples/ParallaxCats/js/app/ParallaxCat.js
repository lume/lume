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

            // Create the cat photo. To scale appropriately
            // we use the `background-image` CSS property set to `cover` instead
            // of using an `<img>` tag
            var cat = new Surface({
                properties: {
                    backgroundImage: 'url(' + options.src + ')',
                    backgroundSize: 'cover'
                },
                origin: [.5, 0],
                proportions: [1.3, 1.3]
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
                    transform: Transform.compose(
                        Transform.skewY(options.skew),
                        Transform.translateY(-options.index * options.parallaxAmount)
                    )
                })
                .add({
                    align: [.5, 0],
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
