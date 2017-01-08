/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var OptionsManager = require('../core/_OptionsManager');
    var SimpleStream = require('../streams/SimpleStream');
    var Timer = require('../core/Timer');

    var MAX_DIFFERENTIAL = 50; // caps mousewheel differentials
    var DEBOUNCE = 100;

    /**
     * Wrapper for DOM wheel/mousewheel events. Converts `scroll` events
     *  to `start`, `update` and `end` events and emits them with the payload:
     *
     *      `value`     - Scroll displacement in pixels from start
     *      `delta`     - Scroll differential in pixels between subsequent events
     *      `velocity`  - Velocity of scroll
     *      `event`     - Original DOM event
     *
     * @example
     *
     *      var scrollInput = new ScrollInput();
     *
     *      scrollInput.subscribe(surface)
     *
     *      scrollInput.on('start', function(payload){
     *          console.log('start', payload);
     *      });
     *
     *      scrollInput.on('update', function(payload){
     *          console.log('update', payload);
     *      });
     *
     *      scrollInput.on('end', function(payload){
     *          console.log('end', payload);
     *      });
     *
     * @class ScrollInput
     * @constructor
     * @extends Streams.SimpleStream
     * @uses Core._OptionsManager
     * @param [options] {Object}                Options
     * @param [options.direction] {Number}      Direction to project movement onto.
     *                                          Options found in TouchInput.DIRECTION.
     * @param [options.scale=1] {Number}        Scale the response to the mouse
     */
    function ScrollInput(options) {
        this.options = OptionsManager.setOptions(this, options);

        this._payload = {
            delta : null,
            value : null,
            cumulate : null,
            velocity : null,
            event : null
        };

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('wheel', handleMove.bind(this));

        this._value = (this.options.direction === undefined) ? [0, 0] : 0;
        this._cumulate = (this.options.direction === undefined) ? [0, 0] : 0;
        this._prevTime = undefined;
        this._inProgress = false;
        this._preventDefault = true;

        var self = this;
        this._scrollEnd = Timer.debounce(function(event){
            self._inProgress = false;
            // this prevents velocities for mousewheel events vs trackpad ones
            if (self._payload.delta !== 0){
                self._payload.velocity = 0;
            }
            self._payload.event = event;

            self._eventOutput.emit('end', self._payload);
        }, DEBOUNCE);
    }

    ScrollInput.prototype = Object.create(SimpleStream.prototype);
    ScrollInput.prototype.constructor = ScrollInput;

    ScrollInput.DEFAULT_OPTIONS = {
        direction: undefined,
        scale: 1
    };

    /**
     * Calls `event.preventDefault` on the DOM scroll event
     *
     * @method preventDefault
     */
    ScrollInput.prototype.preventDefault = function(){
        this._preventDefault = true;
    };

    /**
     * `event.preventDefault` is not called on the DOM scroll event
     *
     * @method enableDefault
     */
    ScrollInput.prototype.enableDefault = function(){
        this._preventDefault = false;
    };

    /**
     * Constrain the input along a specific axis.
     *
     * @property DIRECTION {Object}
     * @property DIRECTION.X {Number}   x-axis
     * @property DIRECTION.Y {Number}   y-axis
     * @static
     */
    ScrollInput.DIRECTION = {
        X : 0,
        Y : 1
    };

    var _now = Date.now;

    function handleMove(event) {
        if (this._preventDefault)
            event.preventDefault(); // Disable default scrolling behavior

        if (!this._inProgress) {
            this._value = (this.options.direction === undefined) ? [0, 0] : 0;
            payload = this._payload;
            payload.value = this._value;
            payload.cumulate = this._cumulate;
            payload.event = event;

            this._eventOutput.emit('start', payload);
            this._inProgress = true;
            return;
        }

        var currTime = _now();
        var prevTime = this._prevTime || currTime;

        var diffX = -event.deltaX;
        var diffY = -event.deltaY;

        if (diffX > MAX_DIFFERENTIAL) diffX = MAX_DIFFERENTIAL;
        if (diffY > MAX_DIFFERENTIAL) diffY = MAX_DIFFERENTIAL;
        if (diffX < -MAX_DIFFERENTIAL) diffX = -MAX_DIFFERENTIAL;
        if (diffY < -MAX_DIFFERENTIAL) diffY = -MAX_DIFFERENTIAL;

        var dt = currTime - prevTime;
        var invDt = 1 / dt;
        this._prevTime = currTime;

        var velX = diffX * invDt;
        var velY = diffY * invDt;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        if (this.options.direction === ScrollInput.DIRECTION.X) {
            nextDelta = scale * diffX;
            nextVel = scale * velX;
            this._value += nextDelta;
            this._cumulate += nextDelta;
        }
        else if (this.options.direction === ScrollInput.DIRECTION.Y) {
            nextDelta = scale * diffY;
            nextVel = scale * velY;
            this._value += nextDelta;
            this._cumulate += nextDelta;
        }
        else {
            nextDelta = [scale * diffX, scale * diffY];
            nextVel = [scale * velX, scale * velY];
            this._value[0] += nextDelta[0];
            this._value[1] += nextDelta[1];
            this._cumulate[0] += nextDelta[0];
            this._cumulate[1] += nextDelta[1];
        }

        var payload = this._payload;
        payload.delta    = nextDelta;
        payload.velocity = nextVel;
        payload.value = this._value;
        payload.cumulate = this._cumulate;
        payload.event = event;

        this._eventOutput.emit('update', payload);

        // debounce `end` event
        this._scrollEnd(event);
    }

    module.exports = ScrollInput;
});
