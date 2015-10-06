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
     * Detects two-finger rotational motion and emits `start`, `update` and
     *  `end` events with the payload data:
     *
     *      `value`         - Angle of rotation
     *      `delta`         - Differential of successive angles
     *      `velocity`      - Velocity of rotation
     *      `center`        - Midpoint between the two touches
     *      `touches`       - Array of DOM event touch identifiers
     *
     * @class RotateInput
     * @extends Inputs.TwoFingerInput
     * @uses Core.OptionsManager
     * @constructor
     * @param options {Object}              Options
     * @param [options.scale=1] {Number}    Scale the response to pinch
     */
    function RotateInput(options) {
        TwoFingerInput.call(this);

        this.options = OptionsManager.setOptions(this, options);

        this._angle = 0;
        this._previousAngle = 0;
    }

    RotateInput.prototype = Object.create(TwoFingerInput.prototype);
    RotateInput.prototype.constructor = RotateInput;

    RotateInput.DEFAULT_OPTIONS = {
        scale : 1
    };

    RotateInput.prototype._startUpdate = function _startUpdate(event) {
        this._previousAngle = TwoFingerInput.calculateAngle(this.posA, this.posB);
        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);

        this._angle = 0;

        this._eventOutput.emit('start', {
            count: event.touches.length,
            value: this._angle,
            center: center,
            touches: [this.touchAId, this.touchBId]
        });
    };

    RotateInput.prototype._moveUpdate = function _moveUpdate(diffTime) {
        var scale = this.options.scale;

        var currAngle = TwoFingerInput.calculateAngle(this.posA, this.posB);
        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);

        var diffTheta = scale * (currAngle - this._previousAngle);
        var velTheta = diffTheta / diffTime;

        this._angle += diffTheta;

        this._eventOutput.emit('update', {
            delta : diffTheta,
            velocity: velTheta,
            value: this._angle,
            center: center,
            touches: [this.touchAId, this.touchBId]
        });

        this._previousAngle = currAngle;
    };

    module.exports = RotateInput;
});
