define(function(require, exports, module){
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var SequentialLayout = require('samsara/layouts/SequentialLayout');
    var FlexLayout = require('samsara/layouts/FlexLayout');

    // FLEX LAYOUT
    var numSurfaces = 5;    // initial population

    // Create the layout with options
    var layout = new FlexLayout({
        origin : [.5,1],
        direction : SequentialLayout.DIRECTION.Y
    });

    // Build the layout
    var surfaces = [];
    var flexes = [];
    for (var i = 0; i < numSurfaces; i++) {
        var surface = createSurface();
        var flex = new Transitionable(Math.random());
        layout.push(surface, flex);

        flexes.push(flex);
        surfaces.push(surface);
    }

    // NAVIGATION
    var nav = new SequentialLayout({
        direction : SequentialLayout.DIRECTION.X,
        spacing : 0
    });

    var actions = [
        'PUSH',         // add at the end
        'POP',          // remove from the end
        'UNSHIFT',      // add at the beginning
        'SHIFT',        // remove from the beginning
        'INSERT',       // insert at a random index
        'ANIMATE'       // animate the flex values
    ];

    for (var i = 0; i < actions.length; i++) {
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
                        var surface = createSurface();
                        var flex = new Transitionable(Math.random());

                        surfaces.push(surface);
                        flexes.push(flex);

                        layout.push(surface, flex);
                        break;
                    case 'POP':
                        if (surfaces.length === 0) return;
                        var surface = surfaces.pop();
                        var flex = flexes.pop();
                        layout.removeItem(surface, flex);
                        break;
                    case 'UNSHIFT':
                        var surface = createSurface();
                        var flex = new Transitionable(Math.random());

                        surfaces.unshift(surface);
                        flexes.unshift(flex);

                        layout.unshift(surface, flex);
                        break;
                    case 'SHIFT':
                        if (surfaces.length === 0) return;
                        var surface = surfaces.shift();
                        var flex = flexes.shift();
                        layout.removeItem(surface, flex);
                        break;
                    case 'INSERT':
                        var surface = createSurface();
                        var flex = new Transitionable(Math.random());

                        var randomIndex = Math.floor(Math.random() * surfaces.length);
                        var randomSurface = surfaces[randomIndex];

                        surfaces.splice(randomIndex, 0, surface);
                        flexes.splice(randomIndex, 0, flex);

                        layout.insertAfter(randomSurface, surface, flex);
                        break;
                    case 'ANIMATE':
                        flexes.forEach(function(flex){
                            flex.set(Math.random(), {duration : 1000, curve : 'easeOutBounce'})
                        });
                }
            });
        })(i);

        nav.push(navSurface);
    }

    // Build a surface with a particular size
    // Add a click handler to remove surface on click
    function createSurface(){
        var surface = new Surface({
            content : 'click to remove',
            size : [undefined, undefined],
            classes : ['listItem', 'center'],
            roundToPixel : true
        });

        surface.on('click', function(){
            var index = surfaces.indexOf(surface);
            surfaces.splice(index, 1);
            var flex = flexes.splice(index, 1);
            layout.removeItem(surface, flex[0]);
        });

        return surface;
    }

    // Build Render Tree
    var context = new Context();
    context.add({
        proportions : [1, 1/15]
    }).add(nav);

    context.add({
        align : [.5,1],
        proportions : [1, 14/15]
    }).add(layout);

    context.mount(document.body);
});
