define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');

    // Represents a tab with title bar, image of the website and eventing
    // logic to close and select a tab.

    // The `Tab` emits `close` and `select` events. Closing a tab removes
    // it from the `Scrollview`, and selecting a tab toggles a fullscreen mode.
    var Tab = View.extend({
        defaults: {
            src: '',
            title: '',
            titleHeight: 30
        },
        initialize: function (options) {
            // Create the title bar
            this.title = new Surface({
                size : [undefined, options.titleHeight],
                content: options.title,
                classes: ['title']
            });

            // Create the `close` button
            this.close = new Surface({
                size : [true, options.titleHeight],
                content: '×',
                classes: ['close']
            });

            // On `click` emit a `close` event that the `TabContainer` will respond to
            this.close.on('click', function () {
                this.emit('close');
            }.bind(this));

            // Create the tab from an image
            this.content = new Surface({
                size: function(parentSize){
                    return [parentSize[0], parentSize[1] - options.titleHeight]
                },
                classes : ['tab'],
                origin : [0,1],
                attributes : {src : options.src},
                tagName : 'img'
            });

            this.selectOpacity = new Transitionable(1);

            // Build the render sub tree, aligning the content to the bottom

            var node = this.add({opacity : this.selectOpacity});

            var inFront = node.add({transform : Transform.inFront,});
            inFront.add(this.title);
            inFront.add(this.close);
            node.add({align : [0,1]}).add(this.content);
        },
        select: function(){
            this.selectOpacity.set(.8, {duration : 100});
        },
        unselect: function(){
            this.selectOpacity.set(1, {duration : 100});
        }
    });

    module.exports = Tab;
});
