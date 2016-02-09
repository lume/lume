define(function (require, exports, module) {
    var Surface = require('samsara/dom/Surface');
    var Context = require('samsara/dom/Context');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');

    var context = new Context();

    var surface = new Surface({
        size : [200, 200],
        origin : [.5, .5],
        properties : {background : 'red'}
    });

    var TESTS = {
        SURFACE : 0,
        NODES : 1,
        TWO : 2
    };

    var test = 1;
    switch (test){
        case TESTS.SURFACE:

            var toggle = true;
            context.on('click', function() {
                (toggle)
                    ? surface.remove()
                    : centerNode.add(surface);
                toggle = !toggle;
            });

            var centerNode = context.add({align : [.5, .5]});
            centerNode.add(surface);

            break;
        case TESTS.NODES:

            var align = new Transitionable([.5,.5]);

            var toggle = true;
            context.on('click', function() {
                (toggle)
                    ? centerNode.remove()
                    : context.add(centerNode).add(surface);
                toggle = !toggle;
            });

            var centerNode = context.add({align : align});
            centerNode.add(surface);

            break;

        case TESTS.TWO:

            var toggle = true;
            context.on('click', function() {
                (toggle)
                    ? centerNode.remove()
                    : context.add({align : [.5, .5]}).add(surface);
                toggle = !toggle;
            });

            var centerNode = context.add({align : [.5, .5]});
            centerNode.add(surface);

            break;
    }

    context.mount(document.body);

});
