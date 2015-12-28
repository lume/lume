define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var Scrollview = require('samsara/layouts/Scrollview');

    var Dots = require('./app/Dots');
    var Arrows = require('./app/Arrows');

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
        direction : Scrollview.DIRECTION.X,
        paginated : true,
        pageTransition : {
            curve : 'spring',
            period : 100,
            damping: 0.8
        },
        edgeTransition: {
            curve: 'spring',
            period: 100,
            damping: 1
        }
    });

    carousel.addItems(surfaces);

    var arrows = new Arrows({
        leftContent  : '❮',
        rightContent : '❯'
    });

    var currentPage = 0;
    arrows.on('next', function(){
        if (currentPage < N - 1)
            carousel.goTo(++currentPage);
    });

    arrows.on('prev', function () {
        if (currentPage > 0)
            carousel.goTo(--currentPage);
    });

    var dots = new Dots({
        numDots: N,
        diameter: 10,
        spacing: 4
    });

    carousel.on('page', function (index) {
        currentPage = index;
        dots.set(index);
    });

    var context = new Context();

    context.add(carousel);
    context.add(arrows);
    context.add({align : [.5,.9]}).add(dots);

    context.mount(document.body);
});