define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var Scrollview = require('samsara/layouts/Scrollview');

    var N = 3;

    var hue = 0;
    var surfaces = [];
    for (var i = 0; i < N; i++){
        var surface = new Surface({
            content : i,
            properties : {
                fontSize : '60px',
                textAlign : 'center',
                background : 'hsl(' + hue + ',100%,50%)'
            }
        });

        surfaces.push(surface);
        hue += 360 / N;
    }

    carousel = new Scrollview({
        direction : 0,
        paginated : true
    });

    var pageTransition = {
        curve: 'spring',
        period: 100,
        damping: .7
    };

    var leftArrow = new Surface({
        content : '⟨',
        size : [true, true],
        origin : [0,0.5],
        properties : {
            fontSize : '60px',
            color : 'white',
            zIndex : 1
        }
    });

    leftArrow.on('click', function () {
        carousel.goto(carousel.getCurrentIndex() - 1, pageTransition)
    });

    var rightArrow = new Surface({
        content: '⟩',
        size: [true, true],
        origin: [1, 0.5],
        properties: {
            fontSize: '60px',
            color: 'white',
            zIndex: 1
        }
    });

    rightArrow.on('click', function () {
        carousel.goto(carousel.getCurrentIndex() + 1, pageTransition)
    });

    carousel.addItems(surfaces);

    var context = new Context();
    context.add(carousel);

    context.add({align : [0,.5]}).add(leftArrow);
    context.add({align : [1,.5]}).add(rightArrow);

    context.mount(document.body);
});