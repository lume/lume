/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var TwoFingerInput = require('./_TwoFingerInput');
    var OptionsManager = require('../core/OptionsManager');

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
     *      `touchIds`      - Array of DOM event touch identifiers
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
     * @param options {Object}              Options
     * @param [options.scale=1] {Number}    Scale the response to pinch
     */
    function ScaleInput(options) {
        TwoFingerInput.call(this);

        this.options = OptionsManager.setOptions(this, options);

        this._eventInput.on('start', start.bind(this));
        this._eventInput.on('update', update.bind(this));
        this._eventInput.on('end', end.bind(this));

        this.payload = {
            count: 0,
            delta : 0,
            velocity : 0,
            value : 1,
            cumulate : 0,
            center : [],
            touchIds : []
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
        scale : 1
    };

    ScaleInput.DIRECTION = {
        X : 0,
        Y : 1
    };

    function start(event){
        var currDist = TwoFingerInput.calculateDistance(this.posA, this.posB, this.options.direction);
        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);

        this.startDist = currDist;
        this.prevDist = currDist;
        this.value = 1;

        var payload = this.payload;
        payload.count = event.touches.length;
        payload.touchIds[0] = this.touchAId;
        payload.touchIds[1] = this.touchBId;
        payload.value = this.value;
        payload.center = center;

        this._eventOutput.emit('start', payload);
    }

    function update(diffTime) {
        var currDist = TwoFingerInput.calculateDistance(this.posA, this.posB, this.options.direction);
        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);

        var scale = this.options.scale;

        var delta = scale * (currDist - this.prevDist) / this.startDist;
        var velocity = delta / diffTime;
        this.value += delta;
        this.cumulate += delta;

        var payload = this.payload;
        payload.delta = delta;
        payload.cumulate = this.cumulate;
        payload.velocity = velocity;
        payload.value = this.value;
        payload.center = center;
        payload.touchIds[0] = this.touchAId;
        payload.touchIds[1] = this.touchBId;

        this._eventOutput.emit('update', payload);

        this.prevDist = currDist;
    }

    function end(){
        this.payload.count = 0;
        this._eventOutput.emit('end', this.payload);
    }

    module.exports = ScaleInput;
});
