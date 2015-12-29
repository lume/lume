define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Carousel = require('./app/Carousel');

    var FastClick = require('./lib/fastClick');
    FastClick.attach(document.body);

    var N = 10;

    var carousel = new Carousel({
        pages : N,
        arrows : {
            leftContent : '❮',
            rightContent : '❯'
        },
        dots : {
            numDots : N,
            diameter : 10,
            spacing : 4
        }
    });

    var context = new Context();
    context.add(carousel);
    context.mount(document.body);
});