define(function(require, exports, module) {
    var Context = require('samsara/dom/Context');
    var App = require('./app/App');

    // Install [FT's fastclick](https://github.com/ftlabs/fastclick) for iOS devices to get around the 300ms click delay
    var FastClick = require('./lib/fastClick');
    FastClick.attach(document.body);

    // Create the logo
    var app = new App({
        origin : [.5,.5],
        cardOffset : 5,
        cardPadding : 10
    });

    // Create a Samsara Context as the root of the render tree
    var context = new Context();

    // Add the logo and center the origin point
    context
        .add({align : [.5,.5]})
        .add(app);

    context.on('click', function(){
        app.toggleAnimation();
    });

    // Mount the context to a DOM element
    context.mount(document.body);
});
