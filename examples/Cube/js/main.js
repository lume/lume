define(function(require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Cube = require('./app/Cube');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');

    // Angle to rotate cube by
    var angle = new Transitionable(0);

    // Map the angle to a rotation `Transform`
    var rotation = angle.map(function (angle) {
        return Transform.compose(
            Transform.rotateX(angle),
            Transform.rotateY(angle)
        );
    });

    // Create the cube
    var cube = new Cube({
        origin : [.5,.5],
        length : 200 // Length of the side of the cube
    });

    // Create a Samsara Context as the root of the render tree
    var context = new Context();

    // Set a perspective on the context
    context.setPerspective(600);

    // Add the cube and center the origin point
    context.add({
        align : [.5,.5],
        transform : rotation
    }).add(cube);

    // Mount the context to a DOM element
    context.mount(document.body);

    // Animate the angle
    angle.loop([
        [2 * Math.PI, {duration : 10000}],
        [0, {duration: 10000}]
    ]);

    // Animate the Cube's length
    cube.length.loop([
        [300, {curve: 'spring', period: 80, damping: .5}],
        [200, {curve: 'spring', period: 80, damping: .5}]
    ]);
});
