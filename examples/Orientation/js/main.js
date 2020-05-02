define(function(require, exports, module) {
    var Window = require('samsara/dom/Window');
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var OrientationInput = require('samsara/inputs/OrientationInput');
    var Quaternion = require('samsara/camera/Quaternion');
    var Cube = require('./app/Cube');
    var Transform = require('samsara/core/Transform');

    var context = new Context();
    var input = new OrientationInput();

    // Create the cube
    var cube = new Cube({
        size : [200, 200],
        origin : [.5,.5]
    });

    input.subscribe(Window);

    context.setPerspective(600);

    var transform = input.pluck('value').map(function(orientation){
        return Quaternion.toTransform(orientation);
    });

    context.add({align : [.5,.5], transform : transform}).add(cube);

    context.mount(document.body);
});
