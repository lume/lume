define(function(require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Logo = require('./app/Logo');

    // Create the logo
    var logo = new Logo({
        proportions : [1/3, false], // The logo's width will be 1/2 the screen
        aspectRatio : 1,            // Forces logo's height = width
        origin : [.5,.5],           // Origin point of the logo for centering
        sides : 6                   // Number of sides
    });

    // Create a Samsara Context as the root of the render tree
    var context = new Context();

    // Set a perspective on the context
    context.setPerspective(10000);

    // Add the logo and center the origin point
    context
        .add({align : [.5,.5]})
        .add(logo);

    // Mount the context to a DOM element
    context.mount(document.body);

    // Begin the animation
    logo.loop();
});
