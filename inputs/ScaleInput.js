/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var TwoFingerInput = require('samsara/inputs/TwoFingerInput');
    var OptionsManager = require('samsara/core/OptionsManager');

    /**
     * Detects two-finger pinching motion and emits `start`, `update` and
     *  `end` events with the payload data:
     *
     *      `value`         - Distance between the two touches
     *      `delta`         - Differential in successive distances
     *      `velocity`      - Relative velocity between two touches
     *      `displacement`  - Total accumulated displacement
     *      `center`        - Midpoint between the two touches
     *      `touches`       - Array of DOM event touch identifiers
     *
     *  Note: Unlike PinchInput, which produces pixel values of displacement
     *  between two touches, ScaleInput produces dimensionless values corresponding
     *  to scaling of the initial distance between the touches. For example, if two
     *  touches begin at 100 px apart, and move to 200 px apart, ScaleInput will emit
     *  a value of 2 (for 2x magnification), while PinchInput will emit a value of 100.
     *
     * @example
     *
     *      var scaleInput = new ScaleInput();
     *
     *      scaleInput.subscribe(Engine) // listens on `window` events
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

        this._startDist = 0;
        this._scaleFactor = 1;
    }

    ScaleInput.prototype = Object.create(TwoFingerInput.prototype);
    ScaleInput.prototype.constructor = ScaleInput;

    ScaleInput.DEFAULT_OPTIONS = {
        scale : 1
    };

    // handles initial touch of two fingers
    ScaleInput.prototype._startUpdate = function _startUpdate(event) {
        this._startDist = TwoFingerInput.calculateDistance(this.posA, this.posB);
        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);

        this._eventOutput.emit('start', {
            count: event.touches.length,
            touches: [this.touchAId, this.touchBId],
            distance: this._startDist,
            center: center
        });
    };

    // handles movement of two fingers
    ScaleInput.prototype._moveUpdate = function _moveUpdate(diffTime) {
        var scale = this.options.scale;

        var currDist = TwoFingerInput.calculateDistance(this.posA, this.posB);
        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);

        var delta = (currDist - this._startDist) / this._startDist;
        var newScaleFactor = Math.max(1 + scale * delta, 0);
        var veloScale = (newScaleFactor - this._scaleFactor) / diffTime;

        this._eventOutput.emit('update', {
            delta : delta,
            scale: newScaleFactor,
            velocity: veloScale,
            distance: currDist,
            center : center,
            touches: [this.touchAId, this.touchBId]
        });

        this._scaleFactor = newScaleFactor;
    };

    module.exports = ScaleInput;
});
