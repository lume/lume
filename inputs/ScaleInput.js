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
     *   Emits 'start', 'update' and 'end' events an object with position, velocity, touch ids, distance, and scale factor.
     *   Useful for determining a scaling factor from initial two-finger touch.
     *
     * @class ScaleInput
     * @extends TwoFingerInput
     * @constructor
     * @param {Object} options default options overrides
     * @param {Number} [options.scale] scale velocity by this factor
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

    function _reset() {
        this.touchAId = undefined;
        this.touchBId = undefined;
    }

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
