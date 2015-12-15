define(function(require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Stream = require('samsara/streams/Stream');
    var Surface = require('samsara/dom/Surface');

    // A NavItem is an item in the navigation bar. It has logic
    // to continuously move between a "front" and "back" mode
    // whether by fading in/out and/or translating.

    // It subscribes to the Drawer Layout thought its input to move
    // between these states. It emits `front click` and `back click`
    // events which get converted to `open` and `close` events in NavBar.js.

    var NavItem = View.extend({
        defaults : {
            contentFront : '',              // content for front surface
            contentBack : '',               // content for back surface
            classes : ['nav', 'item']       // CSS classes
        },
        // Executed on instantiation. Options are patched by the defaults if unspecified.
        initialize : function(options){
            if (options.contentFront){
                var frontSurface = new Surface({
                    content : options.contentFront,
                    classes : options.classes,
                    properties : {zIndex : 1},
                    opacity : this.input.map(function(data){
                        return Math.pow(1 - data.progress, 4);
                    })
                });

                // Emit a `front click` event when clicked.
                frontSurface.on('click', function(){
                    this.emit('front click');
                }.bind(this));

                // Build render subtree
                this.add(frontSurface);
            }

            if (options.contentBack){
                var backSurface = new Surface({
                    content : options.contentBack,
                    classes : options.classes,
                    opacity : this.input.map(function(data){
                        return data.progress;
                    })
                });

                // Emit a `back click` event when clicked.
                backSurface.on('click', function(){
                    this.emit('back click');
                }.bind(this));

                // Build render subtree
                this.add(backSurface);
            }
        }
    });

    module.exports = NavItem;
});