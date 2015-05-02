/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('../core/EventHandler');

    /**
     * Accumulates differentials of event sources that emit an `update`
     *  event carrying a `delta` field (a Number or Array of Numbers).
     *  The accumulated value is stored in a getter/setter.
     *
     * @class Accumulator
     * @constructor
     * @param state {Number|Array|Transitionable}   Initializing value
     * @param [eventName='update'] {String}         Name of update event
     */
    function Accumulator(state) {
        this._state = state || 0;
        this.sources = [];

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('start', function(){
            this._eventOutput.emit('start');
        }.bind(this));

        this._eventInput.on('end', function(){
            this._eventOutput.emit('end');
        }.bind(this));

        this._eventInput.on('update', _handleUpdate.bind(this));
    }

    function _handleUpdate(data) {
        var delta = data.delta;
        var state = this._state;

        // TODO: fix hack for physics
        if (delta.constructor.name === 'Vector'){
            delta = (typeof state === 'number')
                ? delta.get1D()
                : delta.get();
        }

        if (delta.constructor === state.constructor){
            var newState = (delta instanceof Array)
                ? [state[0] + delta[0], state[1] + delta[1]]
                : state + delta;
            this.set(newState);
            this._eventOutput.emit('update', {value : newState});
        }
    }

    Accumulator.prototype.addSource = function(source){
        var index = this.sources.indexOf(source);
        if (index !== -1) return;
        this.sources.push(source);
        this.subscribe(source);
    };

    Accumulator.prototype.removeSource = function(source){
        var index = this.sources.indexOf(source);
        if (index == -1) return;
        this.sources.splice(index, 1);
        this.unsubscribe(source);
    };

    /**
     * Basic getter
     *
     * @method get
     * @return {Number|Array} current value
     */
    Accumulator.prototype.get = function get() {
        for (var i = 0; i < this.sources.length; i++)
            if (this.sources[i].get) this.sources[i].get();
        return this._state;
    };

    /**
     * Basic setter
     *
     * @method set
     * @param state {Number|Array} new value
     */
    Accumulator.prototype.set = function set(state) {
        this._state = state;
    };

    module.exports = Accumulator;
});
