/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var TwoFingerInput = require('./_TwoFingerInput');
    var OptionsManager = require('../core/OptionsManager');

    /**
     * Detects two-finger pinching motion and emits `start`, `update` and
     *  `end` events with the payload data:
     *
     *      `value`         - Distance between the two touches
     *      `delta`         - Differential in successive distances
     *      `velocity`      - Relative velocity between two touches
     *      `displacement`  - Total accumulated displacement
     *      `center`        - Midpoint between the two touches
     *      `touchIds`      - Array of DOM event touch identifiers
     *
     * @example
     *
     *      var pinchInput = new PinchInput();
     *
     *      pinchInput.subscribe(Engine) // listens on `window` events
     *
     *      pinchInput.on('start', function(payload){
     *          console.log('start', payload);
     *      });
     *
     *      pinchInput.on('update', function(payload){
     *          console.log('update', payload);
     *      });
     *
     *      pinchInput.on('end', function(payload){
     *          console.log('end', payload);
     *      });
     *
     * @class PinchInput
     * @extends Inputs.TwoFingerInput
     * @uses Core.OptionsManager
     * @constructor
     * @param options {Object}              Options
     * @param [options.scale=1] {Number}    Scale the response to pinch
     */
    function PinchInput(options){
        TwoFingerInput.call(this);

        this.options = OptionsManager.setOptions(this, options);

        this._eventInput.on('start', start.bind(this));
        this._eventInput.on('update', update.bind(this));
        this._eventInput.on('end', end.bind(this));

        this.payload = {
            count : 0,
            delta : null,
            velocity : null,
            value : null,
            cumulate : null,
            center : [],
            touchIds : []
        };

        this.cumulate = 0;
        this.value = 0;
    }

    PinchInput.prototype = Object.create(TwoFingerInput.prototype);
    PinchInput.prototype.constructor = PinchInput;

    PinchInput.DIRECTION = {
        X : 0,
        Y : 1
    };

    PinchInput.DEFAULT_OPTIONS = {
        scale : 1,
        direction : undefined
    };

    function start(event){
        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);
        this.value = TwoFingerInput.calculateDistance(this.posA, this.posB, this.options.direction);

        var payload = this.payload;
        payload.count = event.touches.length;
        payload.touchIds[0] = this.touchAId;
        payload.touchIds[1] = this.touchBId;
        payload.value = this.value;
        payload.center = center;

        this._eventOutput.emit('start', payload);
    }

    function update(diffTime){
        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);
        var distance = TwoFingerInput.calculateDistance(this.posA, this.posB, this.options.direction);

        var scale = this.options.scale;
        var delta = scale * (distance - this.value);
        var velocity = delta / diffTime;

        this._displacement += delta;

        var payload = this.payload;
        payload.delta = delta;
        payload.cumulate = this.cumulate;
        payload.velocity = velocity;
        payload.value = this.value;
        payload.center = center;
        payload.touchIds[0] = this.touchAId;
        payload.touchIds[1] = this.touchBId;

        this._eventOutput.emit('update', payload);

        this.value = distance;
    }

    function end(){
        this.payload.count = 0;
        this._eventOutput.emit('end', this.payload);
    }

    module.exports = PinchInput;
});
