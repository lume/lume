define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var MouseInput = require('samsara/inputs/MouseInput'); // wraps DOM mouse events
    var TouchInput = require('samsara/inputs/TouchInput'); // wraps DOM touch events
    var GenericInput = require('samsara/inputs/GenericInput'); // unifies multiple input sources
    var App = require('./app/App'); // load our application view

    // Load [FT's fastclick](https://github.com/ftlabs/fastclick) for iOS devices to get around the 300ms click delay
    var FastClick = require('./lib/fastClick');
    FastClick.attach(document.body);

    // Register touch and mouse events for this application. GenericInput allows
    // for a unified input interface for mobile and desktop applications.
    GenericInput.register({
        touch: TouchInput,
        mouse: MouseInput
    });

    // Instantiate the application view with options.
    var app = new App({
        navHeightRatio: 0.1,   // percentage of screen height the nav bar takes
        drawerLength: 250,     // how much to drag the content
        drawerVelocityThreshold: 0.25,   // velocity to toggle a transition
        transitionOpen: {curve: 'spring', period: 80, damping: 0.75}, // slide open transition
        transitionClose: {curve: 'spring', period: 100, damping: 1}   // slide closed transition
    });

    // Create a 3D context DOM element to begin the render tree.
    var context = new Context();
    context.setPerspective(1000);

    // Add the application view to the render tree.
    context.add(app);

    // Mount context to `document.body`
    context.mount(document.body);
});

