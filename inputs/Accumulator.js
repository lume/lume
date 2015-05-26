/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var dirtyQueue = require('famous/core/dirtyQueue');

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
        this._dirty = true;
        this._dirtyLock = 0;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('start', function(){
            console.log(this._dirtyLock)
            if (!this._dirty){
                console.log('acc dirty')
                this._dirty = true;
                this._eventOutput.emit('dirty');
            }
            this._dirtyLock++;
        }.bind(this));

        this._eventInput.on('end', function(){
            if (this._dirtyLock > 0) this._dirtyLock--;
            console.log(this._dirtyLock)
            if (this._dirty && this._dirtyLock == 0){
                console.log('acc clean')
                this._dirty = false;
                this._eventOutput.emit('clean');
            }
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

    Accumulator.prototype.subscribe = function subscribe(source){
        var index = this.sources.indexOf(source);
        if (index !== -1) return;
        this.sources.push(source);
        EventHandler.prototype.subscribe.apply(this._eventInput, arguments);
    };

    Accumulator.prototype.unsubscribe = function unsubscribe(source){
        var index = this.sources.indexOf(source);
        if (index == -1) return;
        this.sources.splice(index, 1);
        EventHandler.prototype.unsubscribe.apply(this._eventInput, arguments);
    };

    /**
     * Basic getter
     *
     * @method get
     * @return {Number|Array} current value
     */
    Accumulator.prototype.get = function get() {
        this._dirty = false;
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
        if (this._state === state) return;
        this._state = state;
        this._dirty = true;
        this._eventOutput.emit('dirty');
        dirtyQueue.push(this);
    };

    Accumulator.prototype.clean = function clean(){
        if (this._dirtyLock == 0) {
            this._dirty = false;
            this.emit('clean');
        }
    };

    module.exports = Accumulator;
});
