define(function(require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var Wedge = require('./app/Wedge');

    /* State*/
    var N = 6;                              // number of wedges
    var swivel = new Transitionable(0);     // animation parameter

    // Create a 3D context, acting as the root of the `render tree`
    // and an HTML container to render other `surfaces` into.
    var context = new Context();

    // Set a 3D perspective on the context.
    context.setPerspective(5000);

    // A reference to the render tree starting from a centered location
    var centeredNode = context.add({align : [.5, .5]});

    // Create N wedges to form the logo.
    var rotation = 0;
    for (var index = 0; index < N; index++){
        var wedge = new Wedge({
            angle : 2 * Math.PI / N
        });

        // The wedge now listens to changes in swivel
        wedge.input.subscribe(swivel);

        // Add the wedge to the render tree with a rotation
        centeredNode.add({transform : Transform.rotateZ(rotation)}).add(wedge);

        rotation += 2 * Math.PI / N;
    }

    // Mount the context to a DOM element
    context.mount(document.body);

    // Initiate the animation
    swivel.loop([
        {
            value: 4 * Math.PI,
            transition: {
                duration: 30000,
                curve: 'easeInOut'
            }
        },
        {
            value: 0,
            transition: {
                duration: 30000,
                curve: 'easeInOut'
            }
        }
    ]);

    // Disable scrolling of page
    window.addEventListener('touchmove', function (event) {
        event.preventDefault();
    });
});
