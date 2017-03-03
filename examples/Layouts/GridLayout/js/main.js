define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var GridLayout = require('samsara/layouts/GridLayout');
    var Transitionable = require('samsara/core/Transitionable');
    var Transform = require('samsara/core/Transform');

    var numRows = 4;
    var numCols = 1;

    layout = new GridLayout({
        spacing : [10,10]
    });

    for (var row = 0; row < numRows; row++){
        for (var col = 0; col < numCols; col++){
            var size = new Transitionable([undefined, undefined]);

            var surface = new Surface({
                content : row + '_' + col,
                size : size,
                properties : {
                    background : 'red',
                    border : '1px solid black'
                }
            });

            layout.push(surface, Math.random(), row);
        }

    }

    window.surface = new Surface({
        content : 'click to remove',
        size : size,
        properties : {
            background : 'red',
            border : '1px solid black'
        }
    });



    // function addItem() {
    //     var size = new Transitionable([100, 50 + 100 * Math.random()]);
    //
    //     var surf = new Surface({
    //         content : 'click to remove',
    //         size : size,
    //         properties : {
    //             background : 'red',
    //             border : '1px solid black'
    //         }
    //     });
    //
    //     surf.on('click', function() {
    //         size.set([100, -spacing], {duration : 1000}, function() {
    //             layout.remove(surf);
    //         });
    //     });
    //
    //     layout.push(surf);
    // }
    //
    // for (var i = 0; i < numSurfaces; i++) {
    //     addItem()
    // }
    //
    // var addSurface = new Surface({
    //     size : [100, 100],
    //     origin : [1, 0],
    //     content : 'click to add',
    //     properties : {
    //         background : 'green'
    //     }
    // });
    //
    // addSurface.on('click', function() {
    //     addItem();
    // });


    var context = new Context();

    context.add(layout);
    context.mount(document.body);
});
