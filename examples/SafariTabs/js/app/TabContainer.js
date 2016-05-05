define(function(require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Surface = require('samsara/dom/Surface');
    var Transitionable = require('samsara/core/Transitionable');
    var Stream = require('samsara/streams/Stream');
    var Tab = require('./Tab');

    // The `TabContainer` handles the communication between the `Tab`
    // and the `Scrollview` in which they are placed.

    // A "container" is necessary since the tab's size is independent from the size
    // the `Scrollview` reads. For instance, the tab is initially taller than the
    // spacing the `Scrollview` allocates. Also, upon deleting a tab, the `TabContainer's`
    // size is shrunk, while the `Tab's` size remains unchanged.
    var TabContainer = View.extend({
        defaults : {
            src : '',
            title : '',
            index : 0,
            titleHeightRatio: 0.06,
            angle : -Math.PI / 5,
            spacing : 150,
            height : 400,
            selectTransition : {duration : 200},
            deselectTransition : {duration : 200}
        },
        initialize: function (options) {
            this.angle = new Transitionable(options.angle); // Angle to rotate the tabs by
            this.deleteShift = new Transitionable(0); // Translation to apply when removing a tab
            this.selected = false; // Boolean whether the tab is selected or not

            this.parentSize = new Transitionable([undefined, options.spacing]); // Size of the view (read my the scrollview)
            this.tabSize = new Transitionable([false, options.height]); // Size of the tab
            this.proportions = new Transitionable([.9, false]);

            this.parentHeight = options.spacing;

            this._size.on('end', function(size){
                this.parentHeight = size[1];
            }.bind(this));

            // Set the view's size
            this.setSize(this.parentSize);

            // Create a tab
            this.tab = new Tab({
                origin : [.5,0],
                size : this.tabSize,
                proportions : this.proportions,
                src : options.src,
                title : options.title,
                titleHeightRatio : options.titleHeightRatio
            });

            // On `close`, call the `close` method
            this.tab.on('close', function(){
                this.close();
            }.bind(this));

            // On `select`, call the `toggle` method
            this.tab.on('select', function(){
                this.toggle();
            }.bind(this));

            // Compute the final transform of the tab by combining
            // the effects of the rotation, scrolling, and deletion translation.
            // On scroll we create a "receding" effect for the top tabs.
            var transform = Stream.lift(function(angle, scrollData, deleteShift){
                if (!scrollData) return false; // This is a bug, sorry!

                // Create the receding effect based on distance from the top tab
                var topShift = Math.exp(scrollData.index - options.index + scrollData.progress) - 1;
                topShift = Math.max(Math.min(topShift, 2), -0.2);

                var x = deleteShift;
                var y = 20 * topShift;
                var z = this.selected ? 0 : -100 * topShift;

                // Rotate the tab, then translate based on the receding effect and the deletion shift
                return Transform.thenMove(
                    Transform.rotateX(angle),
                    [x, y, z]
                );
            }.bind(this), [this.angle, this.input, this.deleteShift]);

            // Build the render subtree
            this.add({
                transform : transform,
                align : [.5,0]
            })
                .add(this.tab);
        },
        // Close the tab by shrinking the containing size, which brings the later tabs closer
        // and translate the tab to the left, out of view, before removing it from the DOM.
        close : function(){
            this.parentSize.set([undefined, 0], {duration: 300});
            this.deleteShift.set(-2000, {duration: 1500}, function () {
                this.tab.remove();
            }.bind(this));
        },
        // Bring the tab to fullscreen and animate the angle to 0.
        // Emit a `goto` event to animate the scrollview to the current tab's index.
        select : function(transition, callback){
            transition = transition || this.options.selectTransition;
            this.angle.set(0, transition);
            this.parentSize.set([undefined, this.parentHeight], transition);
            this.proportions.set([1, false], transition);
            this.tabSize.set([undefined, this.parentHeight], transition, callback);
            this.emit('goto', this.options.index);
            this.selected = true;
        },
        // Bring the tab back to its flow in the scrollview
        deselect : function(transition, callback){
            transition = transition || this.options.deselectTransition;
            this.parentSize.set([undefined, this.options.spacing], transition);
            this.tabSize.set([undefined, this.options.height], transition);
            this.proportions.set([.9, false], transition);
            this.angle.set(this.options.angle, transition, callback);
            this.selected = false;
        },
        // Toggle between `select` and `deselect`
        toggle : function(){
            (this.selected) ? this.deselect() : this.select();
        }
    });

    module.exports = TabContainer;
});
