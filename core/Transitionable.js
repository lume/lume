/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var TweenTransition = require('./../transitions/TweenTransition');
    var EventHandler = require('samsara/core/EventHandler');
    var dirtyQueue = require('samsara/core/queues/dirtyQueue');
    var preTickQueue = require('samsara/core/queues/preTickQueue');
    var tickQueue = require('samsara/core/queues/tickQueue');
    var SimpleStream = require('samsara/streams/SimpleStream');

    /**
     * A state maintainer for a smooth transition between
     *    numerically-specified states. Example numeric states include floats or
     *    Transform objects.
     *
     * An initial state is set with the constructor or set(startState). A
     *    corresponding end state and transition are set with set(endState,
     *    transition). Subsequent calls to set(endState, transition) begin at
     *    the last state. Calls to get(timestamp) provide the interpolated state
     *    along the way.
     *
     * Note that there is no event loop here - calls to get() are the only way
     *    to find state projected to the current (or provided) time and are
     *    the only way to trigger callbacks. Usually this kind of object would
     *    be part of the render() path of a visible component.
     *
     * @class Transitionable
     * @constructor
     * @param {number|Array.Number|Object.<number|string, number>} start
     *    beginning state
     */
    function Transitionable(start) {
        this.transitionQueue = [];
        this.endStateQueue = [];
        this.callbackQueue = [];

        this.state = start || 0;
        this.velocity = undefined;
        this._callback = undefined;
        this._engineInstance = null;
        this._currentMethod = null;
        this._state = STATE.NONE;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        var boundUpdate = this.update.bind(this);

        this._eventOutput.on('start', function(){
            tickQueue.push(boundUpdate);
        });

        this._eventOutput.on('end', function(){
            var index = tickQueue.indexOf(boundUpdate);
            tickQueue.splice(index,1);
        });

        if (start !== undefined){
            preTickQueue.push(function transitionableSet(){
                // make sure didn't set in same tick as defined
                if (this._state == STATE.NONE || this._state == STATE.END)
                    this.set(start);
            }.bind(this));
        }
    }

    Transitionable.prototype = Object.create(SimpleStream.prototype);
    Transitionable.prototype.constructor = Transitionable;

    var transitionMethods = {};
    var STATE = {
        NONE : -1,
        START : 0,
        UPDATE : 1,
        END : 2
    };

    Transitionable.register = function register(name, engineClass) {
        if (!(name in transitionMethods))
            transitionMethods[name] = engineClass;
    };

    Transitionable.unregister = function unregister(name) {
        if (name in transitionMethods) {
            delete transitionMethods[name];
            return true;
        }
        else return false;
    };

    function _loadNext() {
        if (this.endStateQueue.length === 0) {
            if (this._callback) {
                var callback = this._callback;
                this._callback = undefined;
                callback();
            }

            dirtyQueue.push(function(){
                if (this._engineInstance && !this._engineInstance.isActive()){
                    this._state = STATE.END;
                    this.emit('end', this.state);
                }
            }.bind(this));

            return;
        }

        var endValue = this.endStateQueue.shift();
        var transition = this.transitionQueue.shift();
        this._callback = this.callbackQueue.shift();

        var curve = transition.curve;
        var method = (transition instanceof Object && curve && transitionMethods[curve])
            ? transitionMethods[curve]
            : TweenTransition;

        if (this._currentMethod !== method) {
            this._engineInstance = new method();
            this._currentMethod = method;
        }

        this._engineInstance.reset(this.state, this.velocity);

        if (this.velocity !== undefined) {
            this.velocity = this._engineInstance.getVelocity();
            transition.velocity = this.velocity;
        }

        this._engineInstance.set(endValue, transition, _loadNext.bind(this));
    }

    /**Trans
     * Add transition to end state to the queue of pending transitions. Special
     *    Use: calling without a transition resets the object to that state with
     *    no pending actions
     *
     * @method set
     *
     * @param {number|Array.Number|Object.<number, number>} endState
     *    end state to which we interpolate
     * @param {transition=} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {function()=} callback Zero-argument function to call on observed
     *    completion (t=1)
     */
    Transitionable.prototype.set = function set(endState, transition, callback) {
        if (!transition) {
            this.reset(endState, undefined);

            if (this._state !== STATE.START){
                this._state = STATE.START;
                this.emit('start', this.state);
                dirtyQueue.push(function(){
                    if (!this._engineInstance){
                        this._state = STATE.END;
                        this.emit('end', this.state);
                    }
                }.bind(this));
            }

            if (callback) callback();
            return this;
        }

        if (this.isActive()) this.halt();
        else {
            if (this._state !== STATE.START){
                this._state = STATE.START;
                this.emit('start', this.state);
            }
        }

        this.endStateQueue.push(endState);
        this.transitionQueue.push(transition);
        this.callbackQueue.push(callback);

        _loadNext.call(this);

        return this;
    };

    /**
     * Get interpolated state of current action at provided time. If the last
     *    action has completed, invoke its callback.
     *
     * @method get
     *
     * @return {number|Object.<number|string, number>} beginning state
     *    interpolated to this point in time.
     */
    Transitionable.prototype.get = function get() {
        return this.state;
    };

    Transitionable.prototype.update = function update(){
        if (!this._engineInstance) return;
        this.state = this._engineInstance.get();
        this.emit('update', this.state);
    };

    /**
     * Cancel all transitions and reset to a stable state
     *
     * @method reset
     *
     * @param {number|Array.Number|Object.<number, number>} startState
     *    stable state to set to
     */
    Transitionable.prototype.reset = function reset(startState, startVelocity) {
        if (this._engineInstance)
            this._engineInstance.reset(startState);

        this._currentMethod = null;
        this._engineInstance = null;
        this.state = startState;
        this.velocity = startVelocity;
        this.endStateQueue = [];
        this.transitionQueue = [];
        this.callbackQueue = [];
    };

    Transitionable.prototype.iterate = function iterate(values, transitions, callback){
        if (values.length === 0) {
            if (callback) callback();
            return;
        }

        // sugar for same transition across value changes
        var transition = (transitions instanceof Array)
            ? transitions.shift()
            : transitions;

        this.set(values.shift(), transition, function(){
            this.iterate(values, transitions, callback);
        }.bind(this));
    };

    Transitionable.prototype.loop = function(values, transitions, callback){
        var val = values.slice(0);
        this.iterate(values, transitions, function(){
            if (callback) callback();
            this.loop(val, transitions, callback);
        }.bind(this));
    };

    /**
     * Add delay action to the pending action queue queue.
     *
     * @method delay
     *
     * @param {number} duration delay time (ms)
     * @param {function} callback Zero-argument function to call on observed
     *    completion (t=1)
     */
    Transitionable.prototype.delay = function delay(duration, callback) {
        this.set(this.get(), {
            duration: duration,
            curve: function(){return 0;}},
            callback
        );
    };

    /**
     * Is there at least one action pending completion?
     *
     * @method isActive
     *
     * @return {boolean}
     */
    Transitionable.prototype.isActive = function isActive() {
        return this._state == STATE.UPDATE;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     */
    Transitionable.prototype.halt = function halt() {
        var currentState = this.get();

        if (this._engineInstance) this._engineInstance.reset(currentState);

        this._currentMethod = null;
        this._engineInstance = null;
        this.state = currentState;
        this.velocity = undefined;
        this.endStateQueue = [];
        this.transitionQueue = [];
        this.callbackQueue = [];
    };

    module.exports = Transitionable;
});
