define(function(require, exports, module) {
    var Context = require('samsara/dom/Context');
    var ArcballCamera = require('samsara/camera/TrackballCamera');
    var Sphere = require('./app/Sphere');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Quaternion = require('samsara/camera/Quaternion');

    // Radius of sphere (fixed)
    var radius = Math.min(window.innerWidth/2, window.innerHeight/2, 300);

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
    var camera = new ArcballCamera({
        radius : radius,
        position: cameraStartPosition
    });

    // Viewer gets mouse/touch events from context
    camera.subscribe(context);

    // Rotate the sphere to look at a surface when it's clicked
    sphere.on('lookAt', function(transform){
        camera.setPosition([0,0,0], lookAtTransition);
        camera.lookAt(transform, lookAtTransition);
    });

    // Zoom out when the context is clicked
    context.on('click', function(){
        camera.setPosition(cameraStartPosition, lookAtTransition);
    });

    // Create the render tree for the sphere
    var cameraNode = context
        .add(camera)
        .add({align : [.5,.5]})
        .add(sphere);

    // Add a surface in the middle of the sphere that is a
    // transparent gradient that darkens the back hemisphere
    var gradientSurface = new Surface({
        size : [2*radius, 2*radius], // size of sphere
        origin : [.5,.5],
        classes : ['gradient']
    });

    // Transform the gradient surface to follow the sphere
    var gradientSurfaceTransform = camera.orientation.map(function(rotation){
        return Quaternion.toTransform(rotation);
    });

    // Create the render tree for the gradient surface
    cameraNode
        .add({transform : gradientSurfaceTransform})
        .add(gradientSurface);

    // Mount to the DOM
    context.mount(document.querySelector('#sphere'));
});
