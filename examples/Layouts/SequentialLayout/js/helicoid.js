define(function(require, exports, module){
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var SequentialLayout = require('samsara/layouts/SequentialLayout');

    // Parameters
    var spacing = 0;                    // spacing between items
    var numSurfaces = 30;                // initial population
    var height = 50;                 // nav height

    // Create the layout with options
    var layout = new SequentialLayout({
        direction : SequentialLayout.DIRECTION.Y,
        spacing : spacing,
        offset : 0
    });

    layout.setLengthMap(function(length){
        var angleY = -1/20 * Math.PI * (length / height);
        return Transform.composeMany(
            Transform.translateY(length),
            Transform.rotateY(angleY),
            Transform.rotateX(-angleY)
        );

    });

    // Build the layout
    for (var i = 0; i < numSurfaces; i++) {
        var hue = Math.floor(Math.random() * 360);
        var color = 'hsl(' + hue + ',50%,50%)';

        var surface = new Surface({
            size : [400, height],
            origin : [0,.0],
            classes : ['listItem', 'center'],
            properties : {
                background : color
            }
        });

        layout.push(surface);
    }

    // Build Render Tree
    var context = new Context();
    context.setPerspectiveOrigin([.5,.5]);
    var root = context.add({
        align : [.5,.0],
        transform : Transform.translateZ(0)
    });
    context.setPerspective(2000);
    root.add(layout);
    context.mount(document.body);
});
