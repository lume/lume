define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var SequentialLayout = require('samsara/layouts/SequentialLayout');

    // SEQUENTIAL LAYOUT
    var spacing = 5;        // spacing between items
    var numSurfaces = 5;    // initial population

    // Create the layout with options
    var layout = new SequentialLayout({
        direction : SequentialLayout.DIRECTION.Y,
        spacing : spacing
    });

    // Build the layout
    var sizes = [];
    for (var i = 0; i < numSurfaces; i++) {
        var size = new Transitionable([undefined, 100]);
        var surface = createSurface(size);

        layout.push(surface);
        sizes.push(size);
    }

    // NAVIGATION
    var nav = new SequentialLayout({
        direction: SequentialLayout.DIRECTION.X,
        spacing : 0
    });

    var actions = [
        'PUSH',         // add at the end
        'POP',          // remove from the end
        'UNSHIFT',      // add at the beginning
        'SHIFT',        // remove from the beginning
        'INSERT'        // insert at a random index
    ];

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
                        var size = new Transitionable([undefined, 0]);
                        var surface = createSurface(size);

                        sizes.push(size);
                        layout.push(surface);

                        size.set([undefined, 100], {duration : 200});
                        numSurfaces++;
                        break;
                    case 'POP':
                        if (numSurfaces === 0) return;

                        var size = sizes.pop();

                        size.set([undefined, 0], {duration : 200}, function(){
                            var surface = layout.pop();
                            surface.remove();
                        });

                        numSurfaces--;
                        break;
                    case 'UNSHIFT':
                        var size = new Transitionable([undefined, 0]);
                        var surface = createSurface(size);

                        sizes.unshift(size);
                        layout.unshift(surface);

                        size.set([undefined, 100], {duration : 200});

                        numSurfaces++;
                        break;
                    case 'SHIFT':
                        if (numSurfaces === 0) return;

                        var size = sizes.shift();

                        size.set([undefined, 0], {duration : 200}, function(){
                            var surface = layout.shift();
                            surface.remove();
                        });

                        numSurfaces--;
                        break;
                    case 'INSERT':
                        var size = new Transitionable([undefined, 0]);
                        var surface = createSurface(size);

                        var randomIndex = Math.floor(Math.random() * numSurfaces);

                        sizes.splice(randomIndex, 0, size);
                        layout.insertAfter(randomIndex, surface);

                        size.set([undefined, 100], {duration : 200});
                        numSurfaces++;
                        break;
                }
            });
        })(i);

        nav.push(navSurface);
    }

    // Build a surface with a particular size
    // Add a click handler to remove surface on click
    function createSurface(size) {
        var surface = new Surface({
            content : 'click to remove',
            size : size,
            classes : ['listItem', 'center'],
            roundToPixel : true
        });

        surface.on('click', function() {
            var index = sizes.indexOf(size);
            sizes.splice(index, 1);

            size.set([undefined, -spacing], {duration : 300}, function() {
                layout.removeItem(surface);
            });
        });

        return surface;
    }

    // Build Render Tree
    var context = new Context();
    context.add({size : [undefined, 60]}).add(nav);
    context.add({transform : Transform.translateY(60)}).add(layout);
    context.mount(document.body);
});
