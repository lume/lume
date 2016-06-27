/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var TwoFingerInput = require('./_TwoFingerInput');
    var OptionsManager = require('../core/OptionsManager');
    var EventHandler = require('../events/EventHandler');

    /**
     * Detects two-finger rotational motion and emits `start`, `update` and
     *  `end` events with the payload data:
     *
     *      `count`         - Number of simultaneous touches
     *      `value`         - Angle of rotation
     *      `delta`         - Differential of successive angles
     *      `cumulate`      - Total accumulated rotation
     *      `velocity`      - Velocity of rotation
     *      `center`        - Midpoint between the two touches
     *
     * @example
     *
     *      var rotateInput = new RotateInput();
     *      rotateInput.subscribe(surface)
     *
     *      rotateInput.on('start', function(payload){
     *          console.log('start', payload);
     *      });
     *
     *      rotateInput.on('update', function(payload){
     *          console.log('update', payload);
     *      });
     *
     *      rotateInput.on('end', function(payload){
     *          console.log('end', payload);
     *      });
     *
     * @class RotateInput
     * @extends Inputs.TwoFingerInput
     * @uses Core.OptionsManager
     * @constructor
     * @param options {Object}              Options
     * @param [options.scale=1] {Number}    Scale the response to pinch
     */
    function RotateInput(options) {
        this.options = OptionsManager.setOptions(this, options);

        this._eventInput = new TwoFingerInput(this.options);
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('twoFingerStart', start.bind(this));
        this._eventInput.on('twoFingerUpdate', update.bind(this));
        this._eventInput.on('twoFingerEnd', end.bind(this));

        this.payload = {
            count : 0,
            delta : 0,
            velocity : 0,
            value : 1,
            cumulate : 0,
            center : []
        };

        this._angle = 0;
        this._previousAngle = 0;
        this.cumulate = 0;
    }

    RotateInput.prototype = Object.create(TwoFingerInput.prototype);
    RotateInput.prototype.constructor = RotateInput;

    RotateInput.DEFAULT_OPTIONS = {
        scale : 1
    };

    function start(data) {
        this._previousAngle = TwoFingerInput.calculateAngle.call(this, data[0].position, data[1].position);
        var center = TwoFingerInput.calculateCenter.call(this, data[0].position, data[1].position);

        this._angle = 0;

        var payload = this.payload;
        payload.count = event.touches.length;
        payload.value = this._angle;
        payload.cumulate = this.cumulate;
        payload.center = center;

        this._eventOutput.emit('start', this.payload);
    }

    function update(data) {
        var currAngle = TwoFingerInput.calculateAngle.call(this, data[0].position, data[1].position);
        var center = TwoFingerInput.calculateCenter.call(this, data[0].position, data[1].position);

        var scale = this.options.scale;

        var delta = scale * (currAngle - this._previousAngle);
        var velocity = delta / data.dt;

        this._angle += delta;
        this.cumulate += delta;

        var payload = this.payload;
        payload.delta = delta;
        payload.cumulate = this.cumulate;
        payload.velocity = velocity;
        payload.value = this._angle;
        payload.center = center;

        this._eventOutput.emit('update', payload);

        this._previousAngle = currAngle;
    }

    function end(data){
        this._eventOutput.emit('update', this.payload);
    }

    module.exports = RotateInput;
});
