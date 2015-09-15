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
     * Handles two-finger touch events to change position via pinching / expanding.
     *   Emits 'start', 'update' and 'end' events with
     *   position, velocity, touch ids, and distance between fingers.
     *
     * @class PinchInput
     * @extends TwoFingerInput
     * @constructor
     * @param {Object} options default options overrides
     * @param {Number} [options.scale] scale velocity by this factor
     */
    function PinchInput(options) {
        TwoFingerInput.call(this);

        this.options = OptionsManager.setOptions(this, options);

        this._displacement = 0;
        this._previousDistance = 0;
    }

    PinchInput.prototype = Object.create(TwoFingerInput.prototype);
    PinchInput.prototype.constructor = PinchInput;

    PinchInput.DEFAULT_OPTIONS = {
        scale : 1
    };

    PinchInput.prototype._startUpdate = function _startUpdate(event) {
        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);
        this._previousDistance = TwoFingerInput.calculateDistance(this.posA, this.posB);

        this._displacement = 0;

        this._eventOutput.emit('start', {
            count: event.touches.length,
            touches: [this.touchAId, this.touchBId],
            value: this._previousDistance,
            center: center
        });
    };

    PinchInput.prototype._moveUpdate = function _moveUpdate(diffTime) {
        var currDist = TwoFingerInput.calculateDistance(this.posA, this.posB);
        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);

        var scale = this.options.scale;
        var delta = scale * (currDist - this._previousDistance);
        var velocity = delta / diffTime;

        this._displacement += delta;

        this._eventOutput.emit('update', {
            delta : delta,
            velocity: velocity,
            value: currDist,
            displacement: this._displacement,
            center: center,
            touches: [this.touchAId, this.touchBId]
        });

        this._previousDistance = currDist;
    };

    module.exports = PinchInput;
});
