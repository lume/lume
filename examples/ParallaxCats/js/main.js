define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var ParallaxCats = require('./app/ParallaxCats');

    // Location of cat images
    var urls = [
        './assets/cat1.jpg',
        './assets/cat2.jpg',
        './assets/cat3.jpg',
        './assets/cat4.jpg',
        './assets/cat5.jpg',
        './assets/cat6.jpg',
        './assets/cat7.jpg'
    ];

    // Create the parallaxCats view with specified options
    var parallaxCats = new ParallaxCats({
        size : function(parentSize){
            return [Math.min(500, parentSize[0]), parentSize[1]]
        },
        origin: [.5, 0],
        skew : Math.PI / 25,
        parallaxAmount : 80,
        urls : urls
    });

    // Create a Samsara Context as the root of the render tree
    var context = new Context();

    // Add the parallaxCats to the context and center the origin point
    context
        .add({align : [.5,0]})
        .add(parallaxCats);

    // Mount the context to a DOM node
    context.mount(document.body);
});