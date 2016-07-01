/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');
    var OptionsManager = require('../core/OptionsManager');
    var TouchInput = require('./TouchInput');

    /**
     * Generalizes handling of two-finger touch events.
     *  Helper to PinchInput and RotateInput.
     *  This class is meant to be overridden and not used directly.
     *
     * @class TwoFingerInput
     * @extends Streams.SimpleStream
     * @private
     * @constructor
     */
    function TwoFingerInput(options) {
        this.options = OptionsManager.setOptions(this, options);

        this._eventInput = new TouchInput(this.options);
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.payload = [];
        this.touchIdA = undefined;
        this.touchIdB = undefined;
        this.posA = null;
        this.posB = null;

        this._eventInput.on('start', handleStart.bind(this));
        this._eventInput.on('update', handleMove.bind(this));
        this._eventInput.on('end', handleEnd.bind(this));
    }

    TwoFingerInput.prototype = Object.create(SimpleStream.prototype);
    TwoFingerInput.prototype.constructor = TwoFingerInput;

    TwoFingerInput.DIRECTION = {
        X : 0,
        Y : 1
    };

    TwoFingerInput.DEFAULT_OPTIONS = {
        direction : undefined,
        rails : false,
        count : 2
    };

    /**
     * Calculates the angle between two touches relative to [0,1].
     *  Direction option must not be set to x- or y- axes, otherwise 0 is returned.
     *
     * @method calculateAngle
     * @static
     * @param value1 {Array}  First touch location (x,y)
     * @param value2 {Array}  Second touch location (x,y)
     * @return {Number}
     */
    TwoFingerInput.calculateAngle = function(value1, value2) {
        if (this.options.direction !== undefined) return 0;
        var diffX = value2[0] - value1[0];
        var diffY = value2[1] - value1[1];
        return Math.atan2(diffY, diffX);
    };

    /**
     * Calculates the distance between two touches.
     *
     * @method calculateDistance
     * @static
     * @param value1 {Number|Array}  First touch location (x,y)
     * @param value2 {Number|Array}  Second touch location (x,y)
     * @return {Number}
     */
    TwoFingerInput.calculateDistance = function(value1, value2) {
        var direction = this.options.direction;
        
        if (direction === undefined){
            var diffX = value2[0] - value1[0];
            var diffY = value2[1] - value1[1];
            return Math.sqrt(diffX * diffX + diffY * diffY);
        }
        else return Math.abs(value2 - value1);
    };

    /**
     * Calculates the midpoint between two touches.
     *
     * @method calculateCenter
     * @static
     * @param value1 {Number|Array}  First touch location
     * @param value2 {Number|Array}  Second touch location
     * @return {Number|Array}
     */
    TwoFingerInput.calculateCenter = function(value1, value2) {
        return (this.options.direction === undefined)
            ? [0.5 * (value1[0] + value2[0]), 0.5 * (value1[1] + value2[1])]
            : (value1 + value2);
    };

    /**
     * Calculates the combined velocity of the two touches.
     *
     * @method calculateCenter
     * @static
     * @param velocity1 {Number|Array}  First velocity
     * @param velocity2 {Number|Array}  Second velocity
     * @return {Number|Array}
     */
    TwoFingerInput.calculateVelocity = function(velocity1, velocity2){
        return (this.options.direction === undefined)
            ? [0.5 * (velocity1[0] + velocity2[0]), 0.5 * (velocity1[1] + velocity2[1])]
            : 0.5 * (velocity1 + velocity2);
    };

    /**
     * Calculates the direction of the touch.
     *
     * @method calculateOrientation
     * @static
     * @param value1 {Number|Array}  First velocity
     * @param value2 {Number|Array}  Second velocity
     * @return {Number|Array}
     */
    TwoFingerInput.calculateOrientation = function(value1, value2){
        return (this.options.direction === undefined)
            ? [(value2[0] - value1[0]), (value2[1] - value1[1])]
            : value2 - value1;
    };

    /**
     * Detects if orientation has changed.
     *
     * @method detectOrientationChange
     * @static
     * @param dir2 {Number|Array}  First direction
     * @param dir1 {Number|Array}  Second direction
     * @return {Boolean}
     */
    TwoFingerInput.detectOrientationChange = function(dir1, dir2){
        return (this.options.direction === undefined)
            ? dir1[0] * dir2[0] + dir1[1] * dir2[1] <= 0
            : dir1 * dir2 <= 0;
    };

    function getPosition(event){
        var direction = this.options.direction;
        var position;
        if (direction === TwoFingerInput.DIRECTION.X)
            position = event.pageX;
        else if (direction === TwoFingerInput.DIRECTION.Y)
            position = event.pageY;
        else
            position = [event.pageX, event.pageY];

        return position;
    }

    function handleStart(data) {
        data.position = getPosition.call(this, data.event);

        if (this.touchIdA === data.touchId){
            this.payload[0] = data;
        }

        if (this.touchIdA === undefined){
            this.touchIdA = data.touchId;
            this.payload[0] = data;
        }
        else if (this.touchIdB === undefined){
            this.touchIdB = data.touchId;
            this.payload[1] = data;
            this.emit('twoFingerStart', this.payload);
        }
    }

    function handleMove(data) {
        if (this.touchIdA === undefined || this.touchIdB === undefined)
            return false;

        data.position = getPosition.call(this, data.event);

        if (data.touchId === this.touchIdA)
            this.payload[0] = data;
        else if (data.touchId === this.touchIdB)
            this.payload[1] = data;

        this.emit('twoFingerUpdate', this.payload);
    }

    function handleEnd(data) {
        if (this.touchIdA === undefined && this.touchIdB === undefined) return false;

        this.emit('twoFingerEnd', this.payload);
        this.touchIdA = undefined;
        this.touchIdB = undefined;
        this.payload = [];
    }

    module.exports = TwoFingerInput;
});
