define(function(require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Surface = require('samsara/dom/Surface');
    var Transitionable = require('samsara/core/Transitionable');
    var Differential = require('samsara/streams/Differential');
    var Accumulator = require('samsara/streams/Accumulator');
    var Stream = require('samsara/streams/Stream');
    var Tab = require('./Tab');

    var TouchInput = require('samsara/inputs/TouchInput');

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
            titleHeightRatio: 0.06,
            angle : -Math.PI / 5,
            spacing : 150,
            height : 400,
            selectTransition : {duration : 200},
            deselectTransition : {duration : 200}
        },
        initialize: function (options) {
            this.angle = new Transitionable(options.angle); // Angle to rotate the tabs by
            this.deleteShift = new Accumulator(0); // Translation to apply when removing a tab
            this.selected = false; // Boolean whether the tab is selected or not

            this.tabSize = new Transitionable([false, options.height]); // Size of the tab
            this.proportions = new Transitionable([.9, false]);

            // Create a tab
            this.tab = new Tab({
                origin : [.5,0],
                size : this.tabSize,
                proportions : this.proportions,
                src : options.src,
                title : options.title,
                titleHeight : options.titleHeight
            });

            // On `close`, call the `close` method
            this.tab.on('close', function(){
                this.close();
            }.bind(this));

            this.deleteShiftFinal = new Transitionable(0);
            this.deleteShiftDelta = new Differential();
            this.deleteShiftDelta.subscribe(this.deleteShiftFinal);

            var dragInput = new TouchInput({direction : TouchInput.DIRECTION.X});
            dragInput.subscribe(this.tab.title);

            this.deleteShift.subscribe(dragInput.pluck('delta'));
            this.deleteShift.subscribe(this.deleteShiftDelta);

            dragInput.on('start', function(){
                this.tab.select();
                this.emit('start drag');
                this.deleteShiftFinal.halt();
            }.bind(this));

            dragInput.on('end', function(data){
                this.deleteShiftFinal.reset(this.deleteShift.get());
                if ((data.value < -100 && data.velocity < 0) || (data.value < 0 && data.velocity < -.5)){
                    this.deleteShiftFinal.set(-2000, {duration: 1500, velocity : data.velocity}, function () {
                        this.tab.remove();
                    }.bind(this));
                    this.emit('close');
                }
                else if ((data.value > 100 && data.velocity > 0) ||(data.value > 0 && data.velocity > .5)){
                    this.deleteShiftFinal.set(2000, {duration: 1500, velocity : data.velocity}, function () {
                        this.tab.remove();
                    }.bind(this));
                    this.emit('close');
                }
                else {
                    this.deleteShiftFinal.set(0, {
                        curve : 'spring',
                        period : 80,
                        velocity : data.velocity,
                        damping : .7
                    });
                }

                this.tab.unselect();
                this.emit('end drag');
            }.bind(this));

            // Compute the final transform of the tab by combining
            // the effects of the rotation, scrolling, and deletion translation.
            // On scroll we create a "receding" effect for the top tabs.
            var transform = Stream.lift(function(angle, deleteShift){
                // Rotate the tab, then translate based on the receding effect and the deletion shift
                return Transform.thenMove(
                    Transform.rotateX(angle),
                    [deleteShift, 0, 0]
                );
            }.bind(this), [this.angle, this.deleteShift]);

            // Build the render subtree
            this.add({transform : transform, align : [.5,0]})
                .add(this.tab);
        },
        // Close the tab by shrinking the containing size, which brings the later tabs closer
        // and translate the tab to the left, out of view, before removing it from the DOM.
        close : function(){
            this.deleteShiftFinal.set(-2000, {duration: 1500}, function () {
                this.tab.remove();
            }.bind(this));
            this.emit('close');
        }
    });

    module.exports = TabContainer;
});
