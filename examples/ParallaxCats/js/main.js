define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var ContainerSurface = require('samsara/dom/ContainerSurface');
    var Scrollview = require('samsara/layouts/Scrollview');
    var LayoutNode = require('samsara/core/LayoutNode');
    var SizeNode = require('samsara/core/SizeNode');
    var ScrollInput = require('samsara/inputs/ScrollInput');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var View = require('samsara/core/View');

    var ParallaxCat = require('./app/ParallaxCat');
    var Dots = require('./app/Dots');

    var direction = 1;
    var N = 8;
    var size = [400, 400];

    var dots = new Dots({
        numDots : N,
        diameter : 10,
        spacing : 4
    });

    var scrollview = new Scrollview({
        direction: direction,
        damping : 0.3
    });

    dots.on('goto', function(page){
        scrollview.goto(page, {duration : 500});
    });

    scrollview.on('page', function(index){
        dots.trigger('set', index);
    });

    var surfaces = [];
    for (var i = 0; i < N; i++) {
        var parallaxCat = new ParallaxCat({
            size: [undefined, size[1]],
            path: './assets/cat' + (i + 1) + '.jpg',
            offset: -50 * i
        });

        parallaxCat.subscribe(scrollview);

        surfaces.push(parallaxCat);
    }

    scrollview.addItems(surfaces);

    var context = new Context();

    var rootNode = context
        .add({align : [.5,.5]})
        .add({size : [size[0], undefined]})
        .add({origin : [.5,.5]});

    rootNode.add(scrollview);
    rootNode.add({align: [0.5, 0.95]}).add(dots);

    context.mount(document.body);

    window.addEventListener('touchmove', function (event) {
        event.preventDefault();
    });
});