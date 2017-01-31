define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var SafariTabs = require('./app/SafariTabs');

    // This demo mimics the Safari tab viewer on iOS.
    // We create several tabs which are screen captures of popular websites
    // and place them into a `Scrollview`. The tabs are rotated in 3D space
    // for a nice perspective effect as the user scrolls.

    // Tabs can be selected and brought fullscreen, or removed by clicking the
    // `x` button on their title bar.

    // Data for the creation of the tabs
    var tabData = [
        {
            src: './assets/google.jpg',
            title: 'Google'
        },
        {
            src: './assets/twitter.jpg',
            title: 'Twitter'
        },
        {
            src: './assets/js-weekly.jpg',
            title: 'JS Weekly'
        },
        {
            src: './assets/reddit.jpg',
            title: 'Reddit'
        },
        {
            src: './assets/nytimes.jpg',
            title: 'NY Times'
        },
        {
            src: './assets/apple.jpg',
            title: 'Apple'
        },
        {
            src: './assets/wiki.jpg',
            title: 'Wikipedia'
        },
        {
            src: './assets/hn.jpg',
            title: 'Hacker News'
        },
        {
            src : './assets/fb.jpg',
            title : 'Facebook'
        }
    ];

    // Create the safariTabs view with specified options
    var safariTabs = new SafariTabs({
        tabData : tabData,
        perspective: 600,          // Perspective for the scrollview
        tab : {                     // Options for the tab
            titleHeight : 30, // Height of the title bar as a ratio of page height
            angle : -Math.PI/6,     // Angle to rotate the tabs by
            spacing : 150,          // Vertical spacing between tabs
            height : 400            // Total height of the tab
        },
        selectTransition : {duration : 200},    // Animation for selection
        deselectTransition : {duration : 200}   // Animation for deselection
    });

    // Create a Samsara `Context` as the root of the render tree
    var context = new Context();

    // Add the safariTabs to the context and align the origin point to the top
    context.add(safariTabs);

    // Mount the context to a DOM node
    context.mount(document.body);
});