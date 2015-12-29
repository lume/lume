define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var ParallaxCats = require('./app/ParallaxCats');

    var parallaxCats = new ParallaxCats({
        size : [400, undefined],
        origin: [.5, 0],
        skew : Math.PI / 25,
        cats : 8,
        parallaxAmount : 70
    });

    var context = new Context();

    context
        .add({align : [.5,0]})
        .add(parallaxCats);

    context.mount(document.body);
});