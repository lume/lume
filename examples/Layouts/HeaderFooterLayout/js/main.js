define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var Transitionable = require('samsara/core/Transitionable');
    var HeaderFooterLayout = require('samsara/layouts/HeaderFooterLayout');

    // We let the size of the header be a transitionable that animates on clicking the header.
    var headerSize = new Transitionable([undefined, 100]);

    // Header surface
    var header = new Surface({
        content : "Header - click to animate",
        size : headerSize,
        classes: ['header', 'center']
    });

    // Animate the size on click. The layout changes the content's size appropriately.
    header.on('click', function(){
        headerSize.set([undefined, 200], {duration : 500});
    });

    // We let the size of the footer be a transitionable that animates on clicking the header.
    var footerSize = new Transitionable([undefined, 50]);

    var footer = new Surface({
        content : "Footer - click to animate",
        size : footerSize,
        classes : ['footer', 'center']
    });

    // Animate the size on click. The layout changes the content's size appropriately.
    footer.on('click', function(){
        footerSize.set([undefined, 200], {duration : 500});
    });

    // Content surface
    var content = new Surface({
        content : "Content",
        size : [undefined, undefined],
        classes : ['content', 'center']
    });

    // Create the HeaderFooterLayout
    var layout = new HeaderFooterLayout({
        header: header,
        footer: footer,
        content: content
    });

    // Build the render tree
    var context = new Context();
    context.add(layout);
    context.mount(document.body);
});
