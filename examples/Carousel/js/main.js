define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var App = require('./app/App');

    var FastClick = require('./lib/fastClick');
    FastClick.attach(document.body);

    var N = 10;

    var app = new App({
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
    context.add(app);
    context.mount(document.body);
});