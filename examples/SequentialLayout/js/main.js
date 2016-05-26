define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var SequentialLayout = require('samsara/layouts/SequentialLayout');
    var Transitionable = require('samsara/core/Transitionable');
    var Transform = require('samsara/core/Transform');

    var spacing = 5;

    var layout = new SequentialLayout({
        direction : 1,
        spacing : spacing
    });

    function addItem() {
        var size = new Transitionable([100, 50 + 100 * Math.random()]);

        var surf = new Surface({
            content : 'click to remove',
            size : size,
            properties : {
                background : 'red',
                border : '1px solid black'
            }
        });

        surf.on('click', function() {
            size.set([100, -spacing], {duration : 1000}, function() {
                layout.remove(surf);
            });
        });

        layout.push(surf);
    }

    for (var i = 0; i < 5; i++) {
        addItem()
    }

    var addSurface = new Surface({
        size : [100, 100],
        origin : [1, 0],
        content : 'click to add',
        properties : {
            background : 'green'
        }
    });

    addSurface.on('click', function() {
        addItem();
    });


    context = new Context();

    context.add({align : [1, 0]}).add(addSurface);

    context.add(layout);
    context.mount(document.body);
});
