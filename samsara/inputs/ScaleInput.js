/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var TwoFingerInput = require('./_TwoFingerInput');
    var OptionsManager = require('../core/OptionsManager');
    var EventHandler = require('../events/EventHandler');

    /**
     * Detects two-finger pinching motion and emits `start`, `update` and
     *  `end` events with the payload data:
     *
     *      `count`         - Number of simultaneous touches
     *      `value`         - Amount of scaling from starting placement
     *      `delta`         - Difference in scaling
     *      `velocity`      - Relative velocity of the scale
     *      `cumulate`      - Total accumulated scaling
     *      `center`        - Midpoint between the two touches
     *
     *  The value is the ratio of the current displacement between two fingers
     *  with the initial displacement. For example, a value of 1 indicates the fingers
     *  are at the same displacement from where they began. A value of 2 indicates the fingers
     *  are twice as far away as they originally began. A value of 1/2 indicates the fingers
     *  are twice as close as they originally began, etc.
     *
     * @example
     *
     *      var scaleInput = new ScaleInput();
     *      scaleInput.subscribe(surface)
     *
     *      scaleInput.on('start', function(payload){
     *          console.log('start', payload);
     *      });
     *
     *      scaleInput.on('update', function(payload){
     *          console.log('update', payload);
     *      });
     *
     *      scaleInput.on('end', function(payload){
     *          console.log('end', payload);
     *      });
     *
     * @class ScaleInput
     * @extends Inputs.TwoFingerInput
     * @uses Core.OptionsManager
     * @constructor
     * @param options {Object}                  Options
     * @param [options.scale=1] {Number}        Scale the response to pinch
     * @param [options.direction] {Number}      Direction to project movement onto.
     *                                          Options found in ScaleInput.DIRECTION.
     * @param [options.rails=false] {Boolean}   If a direction is specified, movement in the
     *                                          orthogonal direction is suppressed
     */
    function ScaleInput(options) {
        this.options = OptionsManager.setOptions(this, options);

        this._eventInput = new TwoFingerInput(this.options);
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('twoFingerStart', start.bind(this));
        this._eventInput.on('twoFingerUpdate', update.bind(this));
        this._eventInput.on('twoFingerEnd', end.bind(this));

        this.payload = {
            delta : 0,
            velocity : 0,
            value : 0,
            cumulate : 0,
            center : []
        };

        this.startDist = 0;
        this.prevDist = 0;
        this.value = 1;
        this.cumulate = 1;
    }

    ScaleInput.prototype = Object.create(TwoFingerInput.prototype);
    ScaleInput.prototype.constructor = ScaleInput;

    ScaleInput.DEFAULT_OPTIONS = {
        direction : undefined,
        scale : 1,
        rails : false
    };

    ScaleInput.DIRECTION = {
        X : 0,
        Y : 1
    };

    function start(data){
        var center = TwoFingerInput.calculateCenter.call(this, data[0].position, data[1].position);
        var distance = TwoFingerInput.calculateDistance.call(this, data[0].position, data[1].position);

        this.startDist = distance;
        this.prevDist = distance;
        this.value = 1;

        var payload = this.payload;
        payload.value = this.value;
        payload.center = center;

        this._eventOutput.emit('start', payload);

        this.value = distance;
    }

    function update(data) {
        var center = TwoFingerInput.calculateCenter.call(this, data[0].position, data[1].position);
        var distance = TwoFingerInput.calculateDistance.call(this, data[0].position, data[1].position);

        var scale = this.options.scale;

        var delta = scale * (distance - this.prevDist) / this.startDist;
        var velocity = delta / data.dt;
        this.value += delta;
        this.cumulate += delta;

        var payload = this.payload;
        payload.delta = delta;
        payload.cumulate = this.cumulate;
        payload.velocity = velocity;
        payload.value = this.value;
        payload.center = center;

        this._eventOutput.emit('update', payload);

        this.prevDist = distance;
    }

    function end(){
        this._eventOutput.emit('end', this.payload);
    }

    module.exports = ScaleInput;
});
