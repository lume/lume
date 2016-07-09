/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Stream = require('samsara/streams/Stream');
    var Transitionable = require('samsara/core/Transitionable');

    var Differential = require('samsara/streams/Differential');
    var Accumulator = require('samsara/streams/Accumulator');

    var MouseInput = require('samsara/inputs/MouseInput');
    var TouchInput = require('samsara/inputs/TouchInput');
    var GenericInput = require('samsara/inputs/GenericInput');

    GenericInput.register({
        mouse : MouseInput,
        touch : TouchInput
    });

    /**
     * A UI element that creates a slider controllable by mouse and touch events.
     *  A starting value and range is provided, and the user can change the value within
     *  the range by dragging and clicking on the slider.
     *  The slider has a `.value` property that defines its value as a stream.
     *
     *  This file comes with an associated CSS file slider.css
     *
     *  @example
     *
     *      var slider = new Slider({
     *          value : 90,
     *          range : [0, 360],
     *          label : 'angle'
     *      });
     *
     *      var rotation = slider.value.map(function(angle){
     *          return Transform.rotate(Math.PI * angle / 180);
     *      });
     *
     *      context.add({transform : rotation}).add(surface);
     *      context.add(slider);
     *
     * @class Slider
     * @extends View
     * @namespace UI
     * @constructor
     * @param [options] {Object}                    Options
     * @param [options.value=0.5] {Number}          Starting value
     * @param [options.range=[0,1]] {Array}         Range of values ([min, max])
     * @param [options.label] {String}              Name of label
     * @param [options.precision=1] {Number}        Number of decimal points to display
     * @param [options.transition=false] {Object}   Default transition to animate values
     */
    var Slider = View.extend({
        defaults : {
            value : 0.5,
            range : [0, 1],
            label : '',
            precision : 1,
            transition : false
        },
        initialize : function(options){
            setupSurfaces.call(this, options);
            setupState.call(this, options);
            setupEvents.call(this, options);
            setupRenderTree.call(this, options);

            this.size = Stream.lift(function(size, labelSize){
                if (!labelSize) return false;
                return [size[0], size[1] + labelSize[1]];
            }, [this.foreground.size, this.label.size]);
        },
        /**
         * Set a new end value with an optional transition.
         *  An optional callback can fire when the transition completes.
         *
         * @method set
         * @param value {Number|Number[]}           End value
         * @param [transition] {Object}             Transition definition
         * @param [callback] {Function}             Callback
         */
        set : function set(value, transition, callback){
            var ratio = value2ratio.call(this, value);
            if (transition === undefined) transition = this.options.transition;
            if (transition){
                this.transition.reset(this.ratio.get());
                this.transition.set(ratio, transition, callback);
            }
            else this.ratio.set(ratio);
        },
        /**
         * Return the current value of the slider.
         *
         * @method get
         * @return {Number|Number[]}    Current state
         */
        get : function get(){
            return ratio2value.call(this, this.ratio.get());
        }
    });

    function value2ratio(value){
        var min = this.options.range[0];
        var max = this.options.range[1];
        return (value - min) / (max - min);
    }

    function ratio2value(ratio){
        var min = this.options.range[0];
        var max = this.options.range[1];
        return min + ratio * (max - min);
    }

    function setupSurfaces(options){
        this.background = new Surface({
            classes : ['samsara-slider-background']
        });

        this.foreground = new Surface({
            classes : ['samsara-slider-foreground']
        });

        var template = String(
            '<span class="label">' + options.label +
                '<span class="range">' + '[' + options.range[0] + '|' + options.range[1] + ']</span>' +
            '</span>' +
            '<span class="value"></span>'
        );

        this.label = new Surface({
            size : [undefined, true],
            classes : ['samsara-slider-label'],
            content : template
        });

        this.label.on('deploy', function(target){
            this.labelContent = target.querySelector('.value');
        }.bind(this));
    }

    function setupState(options){
        var initRatio = value2ratio.call(this, options.value);
        this.ratio = new Accumulator(initRatio, {min : 0, max : 1});

        this.transition = new Transitionable(initRatio);
        this.transitionDelta = new Differential();
        this.transitionDelta.subscribe(this.transition);

        this.value = this.ratio.map(ratio2value.bind(this));
    }

    function setupRenderTree(options){
        var foregroundTransform = this.ratio.map(function(value){
            return Transform.scaleX(value);
        });

        var labelTransform = this.background.size.map(function(size){
            return Transform.translateY(size[1]);
        });

        // Render tree
        this.add(this.background);
        this.add({transform : foregroundTransform})
            .add(this.foreground);
        this.add({transform : labelTransform})
            .add(this.label);
    }

    function setupEvents(options){
        // Mouse and touch events
        var gestureInput = new GenericInput(
            ['mouse', 'touch'],
            {direction : GenericInput.DIRECTION.X}
        );

        gestureInput.subscribe(this.background);

        // Drags correspond to deltas that get accumulated
        var width;
        var gestureDelta = Stream.lift(function(size, data){
            width = size[0];
            if (!data) return false;

            return data.delta / size[0];
        }, [this.size, gestureInput]);

        // Click on slider hooked up to transition slider value
        var offsetX;
        this.background.on('mousedown', function(event){
            offsetX = event.offsetX;
        });

        this.background.on('mouseup', function(event){
            // Check if the mouse hasn't moved for a "static" click event
            if (event.offsetX !== offsetX) return;
            var ratio = event.offsetX / width;

            // TODO: fix setting bug
            if (this.options.transition){
                this.transition.reset(this.ratio.get());
                this.transition.set(ratio, this.options.transition);
            }
            else this.ratio.set(ratio);
        }.bind(this));

        this.ratio.subscribe(gestureDelta);
        this.ratio.subscribe(this.transitionDelta);

        this.value.on('start', renderValue.bind(this));
        this.value.on('update', renderValue.bind(this));
        this.value.on('end', renderValue.bind(this));
    }

    var prevValue = undefined;
    function renderValue(value){
        if (this.options.precision < 0 || !this.labelContent) return;
        var currValue = value.toFixed(this.options.precision);
        if (currValue !== prevValue)
            this.labelContent.textContent = currValue;
        prevValue = currValue;
    }

    module.exports = Slider;
});
