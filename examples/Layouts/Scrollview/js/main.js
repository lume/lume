define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var Scrollview = require('samsara/layouts/Scrollview');
    var SequentialLayout = require('samsara/layouts/SequentialLayout');

    // Parameters
    var spacing = 0;                    // spacing between items
    var numSurfaces = 7;                // initial population
    var navHeight = 50;                 // nav height
    var startHeight = 100;
    var startSize = [100, undefined];
    var transition = {duration : 100};  // animation transition
    var hue = 0;
    var forward = 0;
    var backward = 0;

    // NAVIGATION
    var nav = new SequentialLayout({
        size : [undefined, navHeight],
        direction: SequentialLayout.DIRECTION.X,
        spacing : spacing
    });

    // Create the layout with options
    var layout = new Scrollview({
        // proportions : [.9,.9],
        // origin : [.5,.5],
        direction : Scrollview.DIRECTION.X,
        spacing : spacing,
        container : {
            properties : {border : '1px solid red'}
        },
        clip: true,
        enableMouseDrag : true
    });

    // Build the layout
    for (var i = 0; i < numSurfaces; i++) {
        var surface1 = createSurface(1);
        layout.push(surface1);

        // var surface2 = createSurface();
        // layout.unshift(surface2);
    }

    // List all actions in the nav bar
    var actions = [
        'PUSH',         // add at the end
        'POP',          // remove from the end
        'UNSHIFT',      // add at the beginning
        'SHIFT'         // remove from the beginning
    ];

    // Build the actions
    for (var i = 0; i < actions.length; i++){
        var navSurface = new Surface({
            content : actions[i],
            proportions : [1 / actions.length, false],
            classes : ['navItem', 'center', 'noselect'],
            roundToPixel : true
        });

        // Add click handler for each action
        (function(i){
            navSurface.on('click', function(){
                switch (actions[i]) {
                    case 'PUSH':
                        var surface = createSurface(1);
                        layout.push(surface);
                        numSurfaces++;
                        break;
                    case 'POP':
                        if (numSurfaces === 0) return;
                        var surface = layout.pop();
                        if (surface) surface.remove();
                        break;
                    case 'UNSHIFT':
                        var surface = createSurface(-1);
                        layout.unshift(surface);
                        numSurfaces++;
                        break;
                    case 'SHIFT':
                        if (numSurfaces === 0) return;
                        var surface = layout.shift();
                        if (surface) surface.remove();
                        numSurfaces--;
                        break;
                }
            });
        })(i);

        nav.push(navSurface);
    }

    // Build a surface with a particular size
    // Add a click handler to remove surface on click
    function createSurface(direction) {
        if (direction === 1){
            size = [startSize[0] + forward*10, startSize[1]];
            forward++;
        }
        else{
            backward++;
            size = [Math.max(startSize[0] - backward*10, 50), startSize[1]];
        }

        hue += 50;
        return new Surface({
            size: size,
            content: size[0],
            classes : ['listItem', 'center'],
            properties : {
                background : 'hsl(' + hue + ',80%,50%)',
                border : '1px solid black'
            }
        });
    }

    // Build Render Tree
    var context = new Context();
    context.add({
        size : [false, navHeight]
    }).add(nav);

    context
        .add({transform : Transform.translateY(navHeight)})
        .add({
            size : function(parentSize){
                return [parentSize[0], parentSize[1] - navHeight]
            }
        })
        // .add({align : [.5,.5]})
        .add(layout);

    context.mount(document.body);
});
