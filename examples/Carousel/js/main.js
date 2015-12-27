define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var Scrollview = require('samsara/layouts/Scrollview');

    var Dots = require('./app/Dots');
    var FastClick = require('./lib/fastClick');
    FastClick.attach(document.body);

    var N = 10;

    var hue = 0;
    var surfaces = [];
    for (var i = 0; i < N; i++){
        var surface = new Surface({
            content : i,
            classes : ['page'],
            properties : {
                background : 'hsl(' + hue + ',80%,50%)'
            }
        });

        surfaces.push(surface);
        hue += 360 / N;
    }

    var carousel = new Scrollview({
        direction : 0,
        paginated : true
    });

    var pageTransition = {
        curve: 'spring',
        period: 100,
        damping: .7
    };

    var leftArrow = new Surface({
        content : '❮',
        size : [true, true],
        origin : [0,0.5],
        classes : ['arrow']
    });

    leftArrow.on('click', function () {
        carousel.goto(carousel.getCurrentIndex() - 1, pageTransition)
    });

    var rightArrow = new Surface({
        content: '❯',
        size: [true, true],
        origin: [1, 0.5],
        classes: ['arrow']
    });

    rightArrow.on('click', function () {
        carousel.goto(carousel.getCurrentIndex() + 1, pageTransition)
    });

    carousel.addItems(surfaces);

    var dots = new Dots({
        numDots: N,
        diameter: 10,
        spacing: 4
    });

    carousel.on('page', function (index) {
        dots.trigger('set', index);
    });

    var context = new Context();
    context.add(carousel);

    context.add({align : [0,.5]}).add(leftArrow);
    context.add({align : [1,.5]}).add(rightArrow);
    context.add({align : [.5,.9]}).add(dots);

    context.mount(document.body);
});