/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var OptionsManager = require('../core/_OptionsManager');
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
     *      `event`         - Original DOM event
     *
     * @class TouchTracker
     * @constructor
     * @private
     * @uses Core._OptionsManager
     * @param [options] {Object}                Options
     * @param [options.memory] {Number}         Number of past touches to record in history
     * @param [options.track] {Number}          Max simultaneous touches to record
     * @param [options.limit] {Number}          Limit number of touches. If reached, no events are emitted
     */
    function TouchTracker(options) {
        this.options = OptionsManager.setOptions(this, options);

        this.history = {};
        this.numTouches = 0;

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
        track : 1,
        limit : Infinity,  // number of simultaneous touches
        memory : 1          // length of recorded history
    };

    /**
     * Record touch data
     *
     * @method track
     * @param id {Number}   touch identifier
     * @param data {Object} touch data
     */
    TouchTracker.prototype.track = function track(id, data) {
        this.numTouches++;
        this.history[id] = [data];
    };

    /**
     * Remove record of touch data
     *
     * @method untrack
     * @param id {Number}   touch identifier
     */
    TouchTracker.prototype.untrack = function track(id){
        this.numTouches--;
        delete this.history[id];
    };

    function getData(touch, event, history) {
        return {
            x: touch.clientX,
            y: touch.clientY,
            touchId : touch.identifier,
            timestamp: now(),
            count: event.touches.length,
            event: touch,
            history: history
        };
    }

    function handleStart(event) {
        if (event.touches.length > this.options.limit) return false;
        if (this.numTouches >= this.options.track) return false;

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var touchId = touch.identifier;
            var data = getData(touch, event, null);
            this._eventOutput.emit('trackstart', data);
            if (!this.history[touchId])
                this.track(touchId, data);
        }
    }

    function handleMove(event) {
        if (event.touches.length > this.options.limit) return false;
        if (this.numTouches > this.options.track) return false;

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
        if (event.touches.length > this.options.limit) return false;
        if (this.numTouches > this.options.track) return false;

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var touchId = touch.identifier;
            var history = this.history[touchId];
            if (history) {
                var data = getData(touch, event, history);
                this._eventOutput.emit('trackend', data);
                this.untrack(touchId);
            }
        }
    }

    module.exports = TouchTracker;
});
