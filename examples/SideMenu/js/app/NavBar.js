define(function(require, exports, module) {
    var Transitionable = require('samsara/core/Transitionable');
    var Surface = require('samsara/dom/Surface');
    var Stream = require('samsara/streams/Stream');
    var View = require('samsara/core/View');
    var SequentialLayout = require('samsara/layouts/SequentialLayout');

    var NavItem = require('./NavItem');

    // Defines the navigation bar. Listens to the Drawer Layout
    // and sends these events to the navigation items.
    var NavBar = View.extend({
        // Executed on instantiation. Options are patched by the defaults if unspecified.
        initialize : function(options){
            // Create a surface with blue color to sit behind the nav
            var background = new Surface({
                classes : ['navBackground']
            });

            // Create left nav item containing "back" and "messages" sections.
            // Translate them by animating their origin relative to the input.
            var left = new NavItem({
                contentFront : 'Back',
                contentBack : 'Messages',
                classes : ['nav', 'left', 'item', 'center'],
                proportions : [1/3, 1],
                origin : this.input.map(function(data){
                    var progress = Math.max(data.progress, 0);
                    return [-progress, 0];
                })
            });

            // Create the center nav item.
            // Translate them by animating their origin relative to the input.
            var center = new NavItem({
                contentFront : 'bit.ly/1OZkIch',
                classes : ['nav', 'item', 'middle', 'center'],
                proportions : [1/3, 1],
                origin : this.input.map(function(data){
                    var progress = Math.max(data.progress, 0);
                    return [-progress, 0];
                })
            });

            // Create the right nav item with details and compose surfaces.
            var right = new NavItem({
                contentFront : 'Details',
                contentBack : '<i class="ion-ios-compose-outline"></i>',
                classes : ['nav', 'right', 'item', 'center'],
                proportions : [1/3, 1]
            });

            // Layout the nav items horizontally in a SequentialLayout
            var layout = new SequentialLayout({
                direction : SequentialLayout.DIRECTION.X
            });
            layout.addItems([left, center, right]);

            // Create the edit surface and position on the left
            var edit = new Surface({
                content : 'Edit',
                classes : ['nav', 'edit', 'item'],
                opacity : this.input.map(function(data){
                    return data.progress;
                })
            });

            // Create back arrow surface and position on the left
            var backArrow = new Surface({
                content : '<i class="ion-chevron-left"></i>',
                classes : ['nav', 'edit', 'item'],
                opacity : this.input.map(function(data){
                    return Math.pow(1 - data.progress, 4);
                })
            });

            // Create the render subtree
            this.add(background);
            this.add(edit);
            this.add(backArrow);
            this.add(layout);

            // Convert a `front click` event from the navItem to an `open` event
            left.on('front click', function(){
                this.emit('open');
            }.bind(this));

            // Convert a `back click` event from the navItem to a `close` event
            left.on('back click', function(){
                this.emit('close');
            }.bind(this));

            // Views listen to the input to get progress data
            // coming from the drawer layout
            left.subscribe(this.input);
            center.subscribe(this.input);
            right.subscribe(this.input);
        }
    });

    module.exports = NavBar;
});