/* Copyright © 2015-2016 David Valdman */

//TODO: deprecate in favor of generic history stream

define(function(require, exports, module) {
    var OptionsManager = require('../core/OptionsManager');
    var EventHandler = require('../events/EventHandler');

    var now = Date.now;

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
     * @param [options.memory] {Number}         Number of touches to record to history
     */
    function TouchTracker(options) {
        this.options = OptionsManager.setOptions(this, options);

        this.history = {};

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('touchstart', handleStart.bind(this));
        this._eventInput.on('touchmove', handleMove.bind(this));
        this._eventInput.on('touchend', handleEnd.bind(this));
        this._eventInput.on('touchcancel', handleEnd.bind(this));
    }

    TouchTracker.DEFAULT_OPTIONS = {
        memory : 1, // length of recorded history
    };

    /**
     * Record touch data, if selective is false.
     * @private
     * @method track
     * @param {Object} data touch data
     */
    TouchTracker.prototype.track = function track(data) {
        this.history[data.identifier] = [data];
    };

    function getData(touch, event, history) {
        return {
            x: touch.clientX,
            y: touch.clientY,
            identifier : touch.identifier,
            timestamp: now(),
            count: event.touches.length,
            event: event,
            history: history
        };
    }

    function handleStart(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var data = getData(touch, event, null);
            this._eventOutput.emit('trackstart', data);
            if (!this.history[touch.identifier]) this.track(data);
        }
    }

    function handleMove(event) {
        event.preventDefault(); // prevents scrolling on mobile

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var history = this.history[touch.identifier];
            if (history) {
                var data = getData(touch, event, history);
                this._eventOutput.emit('trackmove', data);
                if (history.length >= this.options.memory)
                    history.shift();
                history.push(data);
            }
        }
    }

    function handleEnd(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var history = this.history[touch.identifier];
            if (history) {
                var data = getData(touch, event, history);
                this._eventOutput.emit('trackend', data);
                delete this.history[touch.identifier];
            }
        }
    }

    module.exports = TouchTracker;
});
