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
    var OptionsManager = require('samsara/core/OptionsManager');
    var EventHandler = require('samsara/core/EventHandler');

    /**
     * Helper to TouchInput – tracks piped in touch events, organizes touch
     *   events by ID, and emits track events back to TouchInput.
     *   Emits 'trackstart', 'trackmove', and 'trackend' events upstream.
     *
     * @class TouchTracker
     * @constructor
     */

    //TODO: implement max sampling length (default to 2?) and payload caching

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

    var _now = Date.now;

    function _timestampTouch(touch, event, history) {
        return {
            x: touch.clientX,
            y: touch.clientY,
            identifier : touch.identifier,
            origin: event.origin,
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
