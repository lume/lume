/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var EventHandler = require('../events/EventHandler');
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
     * @param options {Object}                  Options
     * @param [options.scale=1] {Number}        Scale the response to pinch
     * @param [options.direction] {Number}      Direction to project movement onto.
     *                                          Options found in TouchInput.DIRECTION.
     * @param [options.rails=false] {Boolean}   If a direction is specified, movement in the
     *                                          orthogonal direction is suppressed
     */
    function PinchInput(options){
        this.options = OptionsManager.setOptions(this, options);

        this._eventInput = new TwoFingerInput(this.options);
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
        
        this._eventInput.on('twoFingerStart', start.bind(this));
        this._eventInput.on('twoFingerUpdate', update.bind(this));
        this._eventInput.on('twoFingerEnd', end.bind(this));

        this.payload = {
            delta : null,
            velocity : null,
            value : null,
            cumulate : null,
            center : []
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
        direction : undefined,
        rails : true
    };

    function start(data){
        var center = TwoFingerInput.calculateCenter.call(this, data[0].position, data[1].position);
        var distance = TwoFingerInput.calculateDistance.call(this, data[0].position, data[1].position);

        var payload = this.payload;
        payload.value = distance;
        payload.center = center;

        this._eventOutput.emit('start', payload);

        this.value = distance;
    }

    function update(data){
        var center = TwoFingerInput.calculateCenter.call(this, data[0].position, data[1].position);
        var distance = TwoFingerInput.calculateDistance.call(this, data[0].position, data[1].position);
        var velocity = TwoFingerInput.calculateVelocity.call(this, data[0].velocity, data[1].velocity);

        var scale = this.options.scale;
        var delta = scale * (distance - this.value);

        var payload = this.payload;
        payload.delta = delta;
        payload.cumulate = this.cumulate;
        payload.velocity = velocity;
        payload.value = this.value;
        payload.center = center;

        this._eventOutput.emit('update', payload);

        this.value = distance;
    }

    function end(){
        this._eventOutput.emit('end', this.payload);
    }

    module.exports = PinchInput;
});
