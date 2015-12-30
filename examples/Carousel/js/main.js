define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Carousel = require('./app/Carousel');

    // Install [FT's fastclick](https://github.com/ftlabs/fastclick) for iOS devices to get around the 300ms click delay
    var FastClick = require('./lib/fastClick');
    FastClick.attach(document.body);

    // Number of pages in the carousel
    var N = 10;

    // Create the carousel view with options
    var carousel = new Carousel({
        pages : N,
        arrows : {
            leftContent : '❮',  // content for the left arrow
            rightContent : '❯', // content for the right arrow
            hideTransition: {duration: 50}, // animation to hide the arrow
            showTransition: {duration: 50}, // animation to show the arrow
            hideOpacity: 0.2 // opacity when the arrow is hidden
        },
        dots : {
            numDots : N,   // number of navigation dots
            diameter : 10, // diameter of a dot in pixels
            spacing : 4,   // spacing between the dots in pixels
            fadeIn : {duration : 50}, // fadeIn transition for active dot
            fadeOut: {duration: 50}   // fadeOut transition for active dot
        },
        scrollview : {
            pageTransition : {       // Pagination transition
                curve: 'spring',
                period: 100,
                damping: 0.8
            },
            edgeTransition: {        // Edge bounce transition (mobile only)
                curve: 'spring',
                period: 100,
                damping: 1
            }
        }
    });

    // Create a Samsara Context as the root of the render tree
    var context = new Context();

    // Add the carousel to the context
    context.add(carousel);

    // Mount the context to a DOM node
    context.mount(document.body);
});