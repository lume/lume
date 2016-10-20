define(function(require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Viewer = require('samsara/camera/Viewer');
    var Sphere = require('./app/Sphere');

    // Radius of sphere
    var radius = Math.min(window.innerWidth/2, 300);

    // Transition definitions
    var lookAtTransition = {    // spring transition to look at a surface when clicked
        curve : 'spring',
        period : 150,
        damping : .75
    };

    var zoomOutTransition = {   // spring transition to zoom out when context is clicked
        curve : 'spring',
        period : 100,
        damping : .75
    };

    // Create the sphere of surfaces
    var sphere = new Sphere({
        numRows : 8,                 // number of latitudes
        colSpacing : 50,             // spacing along latitude
        itemSize : [50, 50],         // size of surface
        size : [2*radius, 2*radius], // size of sphere`
        origin : [.5, .5]            // center the sphere
    });

    var context = new Context();
    context.setPerspective(600);

    // Create "arc-ball" camera starting at [0, 0, -radius]
    var cameraStartPosition = [0, 0, -radius];
    var viewer = new Viewer({
        radius : radius,
        position: cameraStartPosition
    });

    // Viewer gets mouse/touch events from context
    viewer.subscribe(context);

    // Rotate the sphere to look at a surface when it's clicked
    sphere.on('lookAt', function(transform){
        viewer.setPosition([0,0,0], lookAtTransition);
        viewer.lookAtTransform(transform, lookAtTransition);
    });

    // Zoom out when the context is clicked
    context.on('click', function(){
        viewer.setPosition(cameraStartPosition, lookAtTransition);
    });

    // Create the render tree
    var cameraNode = context
        .add(viewer)
        .add({align : [.5,.5]})
        .add(sphere);

    // Mount to the DOM
    context.mount(document.body);
});
