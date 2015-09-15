/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

/* Documentation in progress. May be outdated. */

define(function(require, exports, module) {
    var TwoFingerInput = require('samsara/inputs/TwoFingerInput');
    var OptionsManager = require('samsara/core/OptionsManager');

    /**
     * Handles two-finger touch events to increase or decrease scale via pinching / expanding.
     *   Emits 'start', 'update' and 'end' events an object with position, velocity, touch ids, and angle.
     *   Useful for determining a rotation factor from initial two-finger touch.
     *
     * @class RotateInput
     * @extends TwoFingerInput
     * @constructor
     * @param {Object} options default options overrides
     * @param {Number} [options.scale] scale velocity by this factor
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
