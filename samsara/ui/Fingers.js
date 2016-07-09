/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var SimpleStream = require('samsara/streams/SimpleStream');
    var Transitionable = require('samsara/core/Transitionable');
    var Accumulator = require('samsara/streams/Accumulator');

    var MouseInput = require('samsara/inputs/MouseInput');
    var TouchInput = require('samsara/inputs/TouchInput');
    var GenericInput = require('samsara/inputs/GenericInput');

    GenericInput.register({
        mouse : MouseInput,
        touch : TouchInput
    });

    /**
     *  A UI element that visualizes multi-touch interactions and mouse drags.
     *   On a `touchstart` or `mousedown` event, a `Surface` will animate in over the touch point
     *   This surface will follow the user's dragging behavior, and animate out on a `touchend` or `mouseup` event.
     *   Useful for taking screen captures to showcase what the user is doing while using a touch-responsive application.
     *
     *   This file comes with an associated CSS file fingers.css
     *
     *  @example
     *
     *      var fingers = new Fingers({
     *          diameter : 40,
     *          scaleIn : {duration : 400},
     *          scaleOut : {duration : 300}
     *      });
     *
     *      fingers.subscribe(context); // fingers listens to mouse/touch events from context
     *      context.add(fingers); // finger surfaces render into the context
     *
     * @class Fingers
     * @extends View
     * @namespace UI
     * @constructor
     * @param [options] {Object}                    Options
     * @param [options.diameter=40] {Number}        Diameter of finger surfaces
     * @param [options.opacityIn] {Object|Boolean}  Transition definition for opacity enter animation
     * @param [options.opacityOut] {Object|Boolean} Transition definition for opacity exit animation
     * @param [options.scaleIn] {Object|Boolean}    Transition definition for scale enter animation
     * @param [options.scaleOut] {Object|Boolean}   Transition definition for scale exit animation
     */
    var Fingers = View.extend({
        defaults : {
            diameter : 50,
            opacityIn : {duration : 100},
            opacityOut : {duration : 200},
            scaleIn : {duration : 300, curve : 'easeOut'},
            scaleOut : {duration : 200, curve : 'easeIn'}
        },
        initialize : function(){
            // dictionary whose keys are touchIds and values are objects containing
            // {stream, opacity, surface} references
            this.info = {};

            // external input
            var input = new GenericInput(['mouse', 'touch'], {track : 10});
            input.subscribe(this.input);

            // split incoming streams by touchId
            input.split(function(data){
                var id = data.touchId;
                return (this.info[id])
                    ? this.info[id].stream
                    : createStream.call(this, id);
            }.bind(this));
        }
    });

    function createStream(id){
        var stream = new SimpleStream();
        this.info[id] = {stream : stream};

        stream.on('start', handleStart.bind(this));
        stream.on('end', handleEnd.bind(this));
        return stream;
    }

    // create a surface, opacity and scale transform values. connect displacement of interaction with a transform
    function handleStart(data){
        var info = this.info;
        var id = data.touchId;
        var stream = info[id].stream;

        var pos = [data.event.pageX, data.event.pageY];

        var surface = new Surface({
            size : [this.options.diameter, this.options.diameter],
            origin : [.5, .5],
            classes : ['samsara-fingers']
        });

        var position = new Accumulator(pos);
        position.subscribe(stream.pluck('delta'));

        var opacity = new Transitionable(0);
        opacity.set(1, this.options.opacityIn);

        var scale = new Transitionable(0);
        scale.set(1, this.options.scaleIn);

        // save references for later deletion
        info[id].surface = surface;
        info[id].opacity = opacity;
        info[id].scale = scale;

        var transform = position.map(function(value){
            return Transform.translate(value);
        });

        var scaleTransform = scale.map(function(value){
            return Transform.scale([value, value]);
        });

        this.add({transform : transform, opacity : opacity})
            .add({transform : scaleTransform})
            .add(surface)
    }

    // animate out and remove the surface
    function handleEnd(data){
        var id = data.touchId;
        var info = this.info;

        var surface = info[id].surface;
        var isAnimationOver = 0;

        info[id].opacity.set(0, this.options.opacityOut, function(){
            isAnimationOver++;
            if (isAnimationOver === 2) surface.remove();
        });

        info[id].scale.set(0, this.options.scaleOut, function(){
            isAnimationOver++;
            if (isAnimationOver === 2) surface.remove();
        });

        // delete references
        delete info[id];
    }

    module.exports = Fingers;
});
