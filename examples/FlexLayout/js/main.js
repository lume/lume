define(function(require, exports, module){
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var SequentialLayout = require('samsara/layouts/SequentialLayout');
    var FlexLayout = require('samsara/layouts/FlexLayout');

    // FLEX LAYOUT
    var numSurfaces = 5;    // initial population
    var spacing = 5;        // spacing between surfaces

    // Create the layout with options
    var layout = new FlexLayout({
        origin : [0.5, 1],
        direction : SequentialLayout.DIRECTION.Y,
        spacing : spacing
    });

    // Build the layout
    for (var i = 0; i < numSurfaces; i++) {
        var surface = createSurface();
        var flex = new Transitionable(getRandomValue());
        bindFlex(surface, flex);
        layout.push(surface, flex);
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
        navSurface = new Surface({
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
                        var flex = new Transitionable(getRandomValue());
                        bindFlex(surface, flex);

                        layout.push(surface, flex);
                        numSurfaces++;
                        break;
                    case 'POP':
                        if (numSurfaces === 0) return;
                        layout.pop();
                        numSurfaces--;
                        break;
                    case 'UNSHIFT':
                        var surface = createSurface();
                        var flex = new Transitionable(getRandomValue());
                        bindFlex(surface, flex);

                        layout.unshift(surface, flex);
                        numSurfaces++;
                        break;
                    case 'SHIFT':
                        layout.shift();
                        numSurfaces--;
                        break;
                    case 'INSERT':
                        var surface = createSurface();
                        var flex = new Transitionable(getRandomValue());
                        bindFlex(surface, flex);

                        var randomIndex = Math.floor(Math.random() * numSurfaces);
                        layout.insertAfter(randomIndex, surface, flex);

                        numSurfaces++;
                        break;
                    case 'ANIMATE':
                        var flexes = layout.getFlexes();
                        flexes.forEach(function(flex){
                            flex.set(getRandomValue(), {duration : 1000, curve : 'easeOutBounce'})
                        });
                        break;
                }
            });
        })(i);

        nav.push(navSurface);
    }

    // Build a surface with a particular size
    // Add a click handler to remove surface on click
    function createSurface(){
        var surface = new Surface({
            content : '<div><div class="title center">click to flex</div> <div class="flex-value center"></div></div>',
            size : [undefined, undefined],
            classes : ['listItem', 'vertical-center'],
            roundToPixel : true
        });

        return surface;
    }

    function bindFlex(surface, flex){
        surface.on('deploy', function(target){
            var flexEl = target.querySelector('.flex-value');

            flex.on('update', function(value){
                flexEl.textContent = 'flex value: ' + value.toFixed(2);
            });

            flex.on('end', function(value){
                flexEl.textContent = 'flex value: ' + value.toFixed(0);
            });
        });

        surface.on('click', function(){
            var currentValue = flex.get();
            var randomValue = getRandomValue();
            while (randomValue == currentValue)
                randomValue = getRandomValue();

            flex.set(randomValue, {duration : 500});
        });
    }

    function getRandomValue(){
        return Math.ceil(5 * Math.random())
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
