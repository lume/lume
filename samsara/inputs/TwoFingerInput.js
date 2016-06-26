/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    var _now = Date.now;

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
    function TwoFingerInput() {
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.touchAEnabled = false;
        this.touchBEnabled = false;
        this.timestampA = 0;
        this.timestampB = 0;
        this.touchAId = 0;
        this.touchBId = 0;
        this.posA = null;
        this.posB = null;

        this._eventInput.on('touchstart', handleStart.bind(this));
        this._eventInput.on('touchmove', handleMove.bind(this));
        this._eventInput.on('touchend', handleEnd.bind(this));
        this._eventInput.on('touchcancel', handleEnd.bind(this));
    }

    TwoFingerInput.prototype = Object.create(SimpleStream.prototype);
    TwoFingerInput.prototype.constructor = TwoFingerInput;

    TwoFingerInput.DIRECTION = {
        X : 0,
        Y : 1
    };

    /**
     * Calculates the angle between two touches relative to [0,1].
     *
     * @method calculateAngle
     * @static
     * @param posA {Array}  First touch location (x,y)
     * @param posB {Array}  Second touch location (x,y)
     * @return {Number}
     */
    TwoFingerInput.calculateAngle = function(posA, posB) {
        var diffX = posB[0] - posA[0];
        var diffY = posB[1] - posA[1];
        return Math.atan2(diffY, diffX);
    };

    /**
     * Calculates the distance between two touches.
     *
     * @method calculateDistance
     * @static
     * @param posA {Array}  First touch location (x,y)
     * @param posB {Array}  Second touch location (x,y)
     * @return {Number}
     */
    TwoFingerInput.calculateDistance = function(posA, posB, direction) {
        if (direction === TwoFingerInput.DIRECTION.X){
            return Math.abs(posB[0] - posA[0]);
        }
        else if (direction === TwoFingerInput.DIRECTION.Y){
            return Math.abs(posB[1] - posA[1]);
        }
        else {
            var diffX = posB[0] - posA[0];
            var diffY = posB[1] - posA[1];
            return Math.sqrt(diffX * diffX + diffY * diffY);
        }
    };

    /**
     * Calculates the midpoint between two touches.
     *
     * @method calculateCenter
     * @static
     * @param posA {Array}  First touch location (x,y)
     * @param posB {Array}  Second touch location (x,y)
     * @return {Array}
     */
    TwoFingerInput.calculateCenter = function(posA, posB) {
        return [(posA[0] + posB[0]) / 2.0, (posA[1] + posB[1]) / 2.0];
    };

    function handleStart(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            if (!this.touchAEnabled) {
                this.touchAId = touch.identifier;
                this.touchAEnabled = true;
                this.posA = [touch.pageX, touch.pageY];
                this.timestampA = _now();
            }
            else if (!this.touchBEnabled) {
                this.touchBId = touch.identifier;
                this.touchBEnabled = true;
                this.posB = [touch.pageX, touch.pageY];
                this.timestampB = _now();
                this.trigger('start', event);
            }
        }
    }

    function handleMove(event) {
        if (!(this.touchAEnabled && this.touchBEnabled)) return;
        var prevTimeA = this.timestampA;
        var prevTimeB = this.timestampB;
        var diffTime;
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            if (touch.identifier === this.touchAId) {
                this.posA = [touch.pageX, touch.pageY];
                this.timestampA = _now();
                diffTime = this.timestampA - prevTimeA;
            }
            else if (touch.identifier === this.touchBId) {
                this.posB = [touch.pageX, touch.pageY];
                this.timestampB = _now();
                diffTime = this.timestampB - prevTimeB;
            }
        }

        this.trigger('update', diffTime);
    }

    function handleEnd(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            if (touch.identifier === this.touchAId || touch.identifier === this.touchBId) {
                this.trigger('end', event);
                this.touchAEnabled = false;
                this.touchBEnabled = false;
                this.touchAId = 0;
                this.touchBId = 0;
            }
        }
    }

    module.exports = TwoFingerInput;
});
