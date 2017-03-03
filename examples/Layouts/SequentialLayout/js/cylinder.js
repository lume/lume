define(function(require, exports, module){
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var SequentialLayout = require('samsara/layouts/SequentialLayout');
    var View = require('samsara/core/View');
    var RenderTreeNode = require('samsara/core/nodes/RenderTreeNode');

    // Parameters
    var numSurfaces = 0;
    var maxSurfaces = 10;
    var radius = 400;
    var spacing = 0;
    var pivot = 0;
    var width = 2 * radius * Math.sin(Math.PI / maxSurfaces);
    var startWidth = 0*width;
    var height = 100;
    var transition = {duration : 1000};  // animation transition

    sizes = [];

    // NAVIGATION
    var nav = new SequentialLayout({
        size : [undefined, 100],
        direction : SequentialLayout.DIRECTION.X,
        offset: 0,
        spacing : 0
    });

    // List all actions in the nav bar
    var actions = [
        'PUSH',         // add at the end
        'POP',          // remove from the end
        'UNSHIFT',      // add at the beginning
        'SHIFT',        // remove from the beginning
        'PIVOT +',        // insert at a random index
        'PIVOT -'        // insert at a random index
    ];

    var index = 0;

    // Build the actions
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
                var size, surface;
                switch (actions[i]) {
                    case 'PUSH':
                        size = new Transitionable([startWidth, height]);
                        surface = createSurface(size, index++);

                        sizes.push(size);
                        layout.push(surface);

                        size.set([width, height], transition);
                        numSurfaces++;
                        break;
                    case 'POP':
                        if (numSurfaces === 0) return;

                        size = sizes.pop();

                        size.set([0, height], transition, function(){
                            var surface = layout.pop();
                            surface.remove();
                        });

                        numSurfaces--;
                        break;
                    case 'UNSHIFT':
                        size = new Transitionable([startWidth, height]);
                        surface = createSurface(size, index++);

                        sizes.unshift(size);
                        layout.unshift(surface);

                        size.set([width, height], transition);

                        numSurfaces++;
                        break;
                    case 'SHIFT':
                        if (numSurfaces === 0) return;

                        size = sizes.shift();

                        size.set([startWidth, height], transition, function(){
                            var surface = layout.shift();
                            surface.remove();
                        });

                        numSurfaces--;
                        break;
                    case 'PIVOT +':
                        layout.setPivot(1);
                        break;
                    case 'PIVOT -':
                        layout.setPivot(-1);
                        break;
                }
            });
        })(i);

        nav.push(navSurface);
    }

    // Create the layout with options
    layout = new SequentialLayout({
        direction : SequentialLayout.DIRECTION.X,
        spacing : 0,
        offset : 0
    });

    layout.setLengthMap(function(length){
        // var width = 2 * radius * Math.sin(Math.PI / numSurfaces);
        var angleY = (length / width) * 2 * Math.PI / maxSurfaces;
        var innerRadius = Math.sqrt(radius * radius - width*width / 4);

        var offset = 100 * Math.exp(-Math.abs(length)/100);

        return Transform.moveThen(
            [-width/2,0,innerRadius + offset],
            Transform.rotateY(angleY)
        );
    });

    // Build the layout
    for (var i = 0; i < numSurfaces; i++) {
        var size = new Transitionable([width, height]);
        var surface = createSurface(size, i);

        layout.push(surface);
        sizes.push(size);
    }

    // Build a surface with a particular size
    // Add a click handler to remove surface on click
    function createSurface(size, index){
        var surface = new Surface({
            content : 'click to remove ' + (index || 0),
            size : size,
            classes : ['listItem', 'center'],
            roundToPixel : true
        });

        surface.on('click', function(){
            var index = sizes.indexOf(size);
            sizes.splice(index, 1);

            size.set([0, height], transition, function(){
                // layout.unlink(surface);
                surface.remove();
            });

            numSurfaces--;
        });

        return surface;
    }

    // Build Render Tree
    var context = new Context();
    context.setPerspectiveOrigin([0.5,.5]);
    context.setPerspective(2000);

    context.add(nav);
    context.add({
        align : [0.5,.5],
        transform : Transform.thenMove(
            Transform.rotateX(-Math.PI/8),
            [0,0,-radius]
        )
    }).add(layout);

    layout.output.on('start', function(data){
        console.log('head start', data)
    })

    layout.output.on('end', function(data){
        console.log('head end', data)
    })

    context.mount(document.body);
});
