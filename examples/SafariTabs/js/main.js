define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var SafariTabs = require('./app/SafariTabs');

    var tabURLs = [
        './assets/google.png',
        './assets/twitter.png',
        './assets/js-weekly.png',
        './assets/reddit.png',
        './assets/nytimes.png',
        './assets/samsara-site.png',
        './assets/apple.png',
        './assets/fb.png',
        './assets/wiki.png',
        './assets/hn.png'
    ];

    var tabTitles = [
        'Google',
        'Twitter - SamsaraJS',
        'JavaScript Weekly',
        'Reddit',
        'NY Times',
        'SamsaraJS',
        'Apple',
        'Facebook',
        'Wikipedia',
        'Hacker News'
    ];

    // Create the parallaxCats view with specified options
    var safariTabs = new SafariTabs({
        size : [300, undefined],
        origin: [.5, 0],
        tabs : tabURLs.length,
        srcs : tabURLs,
        titles : tabTitles,
        titleHeight : 26
    });

    // Create a Samsara Context as the root of the render tree
    var context = new Context();

    context.setPerspective(1000);

    // Add the parallaxCats to the context and center the origin point
    context
        .add({align : [.5,0]})
        .add(safariTabs);

    // Mount the context to a DOM node
    context.mount(document.body);
});