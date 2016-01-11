define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');

    // Represents a tab with title bar, image of the website and eventing
    // logic to close and select a tab.

    // The `Tab` emits `close` and `select` events. Closing a tab removes
    // it from the `Scrollview`, and selecting a tab toggles a fullscreen mode.
    var Tab = View.extend({
        defaults: {
            src: '',
            title: '',
            height: 26
        },
        initialize: function (options) {
            // Create the title bar
            this.title = new Surface({
                size: [undefined, options.height],
                content: options.title,
                classes: ['title'],
                properties: {
                    lineHeight: options.height + 'px'
                }
            });

            // Create the `close` button
            this.close = new Surface({
                size: [40, options.height],
                content: '×',
                classes: ['close'],
                properties: {
                    lineHeight: options.height - 2 + 'px'
                }
            });

            // On `click` emit a `close` event that the `TabContainer` will respond to
            this.close.on('click', function () {
                this.emit('close');
            }.bind(this));

            // Create the tab content from the provided URL source as a `<div>` with background image
            this.content = new Surface({
                classes: ['tab'],
                margins: [0, options.height/2],
                properties: {
                    backgroundImage: 'url(' + options.src + ')',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top'
                }
            });

            // On `click` emit a `select` event that the `TabContainer` will respond to
            this.content.on('click', function(){
                this.emit('select');
            }.bind(this));

            // Build the render subtree
            this.add(this.title);
            this.add(this.close);
            this.add({transform : Transform.translateY(options.height)})
                .add(this.content);
        },
        // Remove the tab. This will remove the DOM content for later reuse.
        // Note: this API is currently experimental and will be fleshed out in a later version.
        remove : function(){
            this.content.remove();
            this.title.remove();
            this.close.remove();
        }
    });

    module.exports = Tab;
});
