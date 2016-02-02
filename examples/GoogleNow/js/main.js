define(function(require, exports, module) {
    var Context = require('samsara/dom/Context');
    var App = require('./app/App');

    // This demo showcases coordinating several animations together,
    // including combining physics transitions and easing curves,
    // as well as relatively positioning elements based on their sizes.

    // This demo's concept is taken from a [FramerJS demo](http://framerjs.com/examples/preview/#google-now-overview.framer)
    // created by [Noah Levin](https://twitter.com/nlevin).

    // Install [FT's fastclick](https://github.com/ftlabs/fastclick) for iOS devices to get around the 300ms click delay
    var FastClick = require('./lib/fastClick');
    FastClick.attach(document.body);

    var imgURLs = {
        statusBar : './assets/status-bar.png',
        mic : './assets/mic.png',
        topNav : './assets/topNav.png',
        mountains : './assets/mountains.jpg',
        googleColor : './assets/google-color.svg',
        googleWhite : './assets/google-white.svg',
        trafficCard : './assets/traffic-card.jpg',
        movieCard : './assets/movie-card.jpg'
    };

    // Create the application
    var app = new App({
        origin : [.5,.5],
        springTransition: {     // Physics spring transition
            curve: 'spring',
            period: 60,
            damping: 0.75
        },
        easingTransition: {     // Easing curve transition
            curve: 'easeIn',
            duration: 200
        },
        cardOffset : 5,     // Offset that staggers the cards
        cardPadding : 10,   // Spacing between the cards when expanded
        imgURLs : imgURLs
    });

    // Create a Samsara Context as the root of the render tree
    var context = new Context();

    // Add the app view and center the origin point
    context
        .add({align : [.5,.5]})
        .add(app);

    // When the DOM node of the `Context` is clicked on, animate the application
    context.on('click', function(){
        app.toggleAnimation();
    });

    // Mount the context to a DOM element
    context.mount(document.body);
});
