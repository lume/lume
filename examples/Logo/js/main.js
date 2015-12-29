define(function(require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Logo = require('./app/Logo');

    // Create a context
    var context = new Context();

    context.setPerspective(10000);

    var logo = new Logo({
        proportions : [1/2, false],
        aspectRatio : 1,
        origin : [.5,.5],
        sides : 6
    });

    context
        .add({align : [.5,.5]})
        .add(logo);

    // Mount the context to a DOM element
    context.mount(document.body);

    logo.loop();
});
