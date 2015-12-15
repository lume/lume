define(function(require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Surface = require('samsara/dom/Surface');
    var GenericInput = require('samsara/inputs/GenericInput');

    // The Content is the large area composed of a blue background
    // and spinning hand. It responds to user input, (either mouse or touch).
    // and broadcasts this input out to the drawer layout defined in App.js.
    var Content = View.extend({
        initialize : function(){
            // Create the spinning hand.
            var hand = new Surface({
                content : '☞',
                classes : ['hand'],
                size : [50,85],
                origin : [.5,.5]
            });

            // Create the background.
            var background = new Surface({
                content : 'Drag me',
                classes : ['content', 'center']
            });

            // Create a gesture input unifying touch and mouse inputs.
            var gestureInput = new GenericInput(
                ['mouse', 'touch'],
                {direction : GenericInput.DIRECTION.X}
            );

            // The background is the source for the gesture.
            gestureInput.subscribe(background);

            // Broadcast the gesture out of the view.
            this.output.subscribe(gestureInput);

            // Transform for rotating the hand.
            var handTransform = this.input.map(function (data) {
                var progress = Math.PI * data.progress;
                return Transform.rotateZ(progress);
            });

            // Create the render subtree.
            this.add(background);
            this.add({
                align : [.5,.5], // center hand
                transform: handTransform
            }).add(hand);
        }
    });

    module.exports = Content;
});