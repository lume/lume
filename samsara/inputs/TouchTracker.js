/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015-2016 David Valdman */

//TODO: deprecate in favor of generic history stream

define(function(require, exports, module) {
    var OptionsManager = require('../core/OptionsManager');
    var EventHandler = require('../events/EventHandler');

    var _now = Date.now;

    /**
     * Catalogues a history of touch events. Useful for creating more complex
     *  touch recognition for gestures. Currently only used by TouchInput to
     *  track previous touches to compute velocity.
     *
     * TouchTracker emits these events with the following payload data:
     *
     *      `x`             - Displacement in x-direction
     *      `y`             - Displacement in y-direction
     *      `identifier`    - DOM event touch identifier
     *      `timestamp`     - Timestamp
     *      `count`         - DOM event for number of simultaneous touches
     *      `history`       - History of touches for the gesture
     *
     * @class TouchTracker
     * @constructor
     * @private
     * @uses Core.OptionsManager
     * @param [options] {Object}                Options
     * @param [options.limit] {Number}          Number of touches to record
     */
    function TouchTracker(options) {
        this.options = OptionsManager.setOptions(this, options);

        this.touchHistory = {};
        this._isTouched = false;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('touchstart', _handleStart.bind(this));
        this._eventInput.on('touchmove', _handleMove.bind(this));
        this._eventInput.on('touchend', _handleEnd.bind(this));
        this._eventInput.on('touchcancel', _handleEnd.bind(this));
    }

    TouchTracker.DEFAULT_OPTIONS = {
        limit : 1 // number of simultaneous touches
    };

    /**
     * Record touch data, if selective is false.
     * @private
     * @method track
     * @param {Object} data touch data
     */
    TouchTracker.prototype.track = function track(data) {
        this.touchHistory[data.identifier] = [data];
    };

    function _timestampTouch(touch, event, history) {
        return {
            x: touch.clientX,
            y: touch.clientY,
            identifier : touch.identifier,
            timestamp: _now(),
            count: event.touches.length,
            history: history
        };
    }

    function _handleStart(event) {
        if (event.touches.length > this.options.limit) return;
        this._isTouched = true;

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var data = _timestampTouch(touch, event, null);
            this._eventOutput.emit('trackstart', data);
            if (!this.touchHistory[touch.identifier]) this.track(data);
        }
    }

    function _handleMove(event) {
        event.preventDefault(); // prevents scrolling on mobile
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var history = this.touchHistory[touch.identifier];
            if (history) {
                var data = _timestampTouch(touch, event, history);
                this.touchHistory[touch.identifier].push(data);
                this._eventOutput.emit('trackmove', data);
            }
        }
    }

    function _handleEnd(event) {
        if (!this._isTouched) return;

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var history = this.touchHistory[touch.identifier];
            if (history) {
                var data = _timestampTouch(touch, event, history);
                this._eventOutput.emit('trackend', data);
                delete this.touchHistory[touch.identifier];
            }
        }

        this._isTouched = false;
    }

    module.exports = TouchTracker;
});
