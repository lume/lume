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
    var surfaces = [];
    var sizes = [];
    for (var i = 0; i < numSurfaces; i++) {
        var size = new Transitionable([undefined, 100]);
        var surface = createSurface(size);

        layout.push(surface);
        surfaces.push(surface);
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

                        surfaces.push(surface);
                        sizes.push(size);
                        layout.push(surface);

                        size.set([undefined, 100], {duration : 200});
                        break;
                    case 'POP':
                        if (surfaces.length === 0) return;

                        var surface = surfaces.pop();
                        var size = sizes.pop();

                        size.set([undefined, 0], {duration : 200}, function(){
                            layout.removeItem(surface);
                        });
                        break;
                    case 'UNSHIFT':
                        var size = new Transitionable([undefined, 0]);
                        var surface = createSurface(size);

                        surfaces.unshift(surface);
                        sizes.unshift(size);
                        layout.unshift(surface);

                        size.set([undefined, 100], {duration : 200});
                        break;
                    case 'SHIFT':
                        if (surfaces.length === 0) return;

                        var surface = surfaces.shift();
                        var size = sizes.shift();

                        size.set([undefined, 0], {duration : 200}, function(){
                            layout.removeItem(surface);
                        });
                        break;
                    case 'INSERT':
                        var size = new Transitionable([undefined, 0]);
                        var surface = createSurface(size);

                        var randomIndex = Math.floor(Math.random() * surfaces.length);
                        var randomSurface = surfaces[randomIndex];

                        surfaces.splice(randomIndex, 0, surface);
                        sizes.splice(randomIndex, 0, size);
                        layout.insertAfter(randomSurface, surface);

                        size.set([undefined, 100], {duration : 200});
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
            var index = surfaces.indexOf(surface);
            surfaces.splice(index, 1);
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
