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
            src: './assets/google.png',
            title: 'Google'
        },
        {
            src: './assets/twitter.png',
            title: 'Twitter'
        },
        {
            src: './assets/js-weekly.png',
            title: 'JS Weekly'
        },
        {
            src: './assets/reddit.png',
            title: 'Reddit'
        },
        {
            src: './assets/nytimes.png',
            title: 'NY Times'
        },
        {
            src: './assets/samsara-site.png',
            title: 'SamsaraJS'
        },
        {
            src: './assets/apple.png',
            title: 'Apple'
        },
        {
            src: './assets/wiki.png',
            title: 'Wikipedia'
        },
        {
            src: './assets/hn.png',
            title: 'Hacker News'
        }
    ];

    // Create the parallaxCats view with specified options
    var safariTabs = new SafariTabs({
        proportions : [.9, 1],
        origin: [.5, 0],
        tabData : tabData,
        tab : {                     // Options for the tab
            titleHeight : 26,       // Height of the title bar
            angle : -Math.PI/5,     // Angle to rotate the tabs by
            spacing : 150,          // Vertical spacing between tabs
            height : 700            // Total height of the tab
        },
        selectTransition : {duration : 200},    // Animation for selection
        deselectTransition : {duration : 200}   // Animation for deselection
    });

    // Create a Samsara `Context` as the root of the render tree
    var context = new Context();

    // Set the perspective for the `Context`
    context.setPerspective(1000);

    // Add the safariTabs to the context and align the origin point to the top
    context
        .add({align : [.5,0]})
        .add(safariTabs);

    // Mount the context to a DOM node
    context.mount(document.body);
});