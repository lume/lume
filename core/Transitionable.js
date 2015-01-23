/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Utility = require('../core/Utility');
    var TweenTransition = require('./../transitions/TweenTransition');
    var EventHandler = require('famous/core/EventHandler');

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
        this._active = false;
        this.actionQueue = [];
        this.callbackQueue = [];

        this.state = 0;
        this.velocity = undefined;
        this._callback = undefined;
        this._engineInstance = null;
        this._currentMethod = null;
        this._dirty = true;

        this._eventOutput = null;

        this.set(start);
    }

    var transitionMethods = {};

    Transitionable.registerMethod = function registerMethod(name, engineClass) {
        if (!(name in transitionMethods))
            transitionMethods[name] = engineClass;
    };

    Transitionable.unregisterMethod = function unregisterMethod(name) {
        if (name in transitionMethods) {
            delete transitionMethods[name];
            return true;
        }
        else return false;
    };

    //TODO: Test flipper with multiple overwrites fired
    function _loadNext() {
        if (this.actionQueue.length <= 0) {
            this.set(this.get()); // no update required
            this._active = false;
            if (this._eventOutput) this._eventOutput.emit('end', {
                value : this.state,
                velocity : this.velocity
            });

            if (this._callback) {
                var callback = this._callback;
                this._callback = undefined;
                callback();
            }

            return;
        }

        var currentAction = this.actionQueue.shift();
        this._callback = this.callbackQueue.shift();

        var method = null;
        var endValue = currentAction[0];
        var transition = currentAction[1];
        if (transition instanceof Object && transition.method) {
            method = transition.method;
            if (typeof method === 'string') method = transitionMethods[method];
        }
        else method = TweenTransition;

        if (this._currentMethod !== method) {
            this._engineInstance = (!(endValue instanceof Object) || method.SUPPORTS_MULTIPLE === true || endValue.length <= method.SUPPORTS_MULTIPLE)
                ? new method()
                : new MultipleTransition(method);
            this._currentMethod = method;
        }

        this._engineInstance.reset(this.state, this.velocity);
        if (this._eventOutput) this._eventOutput.emit('start', {value : this.state});

        if (this.velocity !== undefined) {
            this.velocity = this._engineInstance.getVelocity();
            transition.velocity = this.velocity;
        }

        this._engineInstance.set(endValue, transition, _loadNext.bind(this));
    }

    /**
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
            this.reset(endState);
            this._active = false;
            if (callback) callback();
            return this;
        }

        var action = [endState, transition];
        this.actionQueue.push(action);
        this.callbackQueue.push(callback);
        if (!this.isActive()) {
            this._active = true;
            _loadNext.call(this);
        }
        return this;
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
        if (this.state == startState && this.velocity == startVelocity) {
            this._dirty = false;
            return;
        };
        this._currentMethod = null;
        this._engineInstance = null;
        this._callback = undefined;
        this.state = startState;
        this.velocity = startVelocity;
        this.actionQueue = [];
        this.callbackQueue = [];
        this._dirty = true;
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
        this.set(this.get(), {duration: duration, curve: function(){return 0;}}, callback);
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
        if (!this.isActive()) return this.state;

        if (this._engineInstance) {
            var state = this._engineInstance.get();

            if (this.state == state) {
                this._dirty = false;
                return state;
            }

            if (this._eventOutput){
                //TODO: put this somewhere else
                var delta;
                if (state instanceof Array){
                    delta = [];
                    for (var i = 0; i < state.length; i++)
                        delta[i] = state[i] - this.state[i];
                }
                else delta = state - this.state;

                this._dirty = true;
                this.state = state;

                if (this._dirty){
                    this._eventOutput.emit('update', {
                        delta : delta,
                        value : state
                    });
                }
            }
            else this.state = state;
        }
        return this.state;
    };

    /**
     * Is there at least one action pending completion?
     *
     * @method isActive
     *
     * @return {boolean}
     */
    Transitionable.prototype.isActive = function isActive() {
        return this._active;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     */
    Transitionable.prototype.halt = function halt() {
        this.set(this.get());
        this._active = false;
    };

    function _createEventOutput() {
        this._eventOutput = new EventHandler();
        this._eventOutput.bindThis(this);
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Transitionable.prototype.on = function on() {
        _createEventOutput.call(this);
        return this.on.apply(this, arguments);
    };

    Transitionable.prototype.off = function off() {
        _createEventOutput.call(this);
        return this.off.apply(this, arguments);
    };

    Transitionable.prototype.pipe = function pipe() {
        _createEventOutput.call(this);
        return this.pipe.apply(this, arguments);
    };

    Transitionable.prototype.unpipe = function unpipe() {
        _createEventOutput.call(this);
        return this.unpipe.apply(this, arguments);
    };

    /**
     * Transition meta-method to support transitioning multiple
     *   values with scalar-only methods.
     *
     *
     * @class MultipleTransition
     * @constructor
     *
     * @param {Object} method Transionable class to multiplex
     */
    function MultipleTransition(method) {
        this.method = method;
        this._instances = [];
        this.state = [];
    }

    MultipleTransition.SUPPORTS_MULTIPLE = true;

    /**
     * Get the state of each transition.
     *
     * @method get
     *
     * @return state {Number|Array} state array
     */
    MultipleTransition.prototype.get = function get() {
        for (var i = 0; i < this._instances.length; i++) {
            this.state[i] = this._instances[i].get();
        }
        return this.state;
    };

    /**
     * Set the end states with a shared transition, with optional callback.
     *
     * @method set
     *
     * @param {Number|Array} endState Final State.  Use a multi-element argument for multiple transitions.
     * @param {Object} transition Transition definition, shared among all instances
     * @param {Function} callback called when all endStates have been reached.
     */
    MultipleTransition.prototype.set = function set(endState, transition, callback) {
        var _allCallback = Utility.after(endState.length, callback);
        for (var i = 0; i < endState.length; i++) {
            if (!this._instances[i]) this._instances[i] = new (this.method)();
            this._instances[i].set(endState[i], transition, _allCallback);
        }
    };

    /**
     * Reset all transitions to start state.
     *
     * @method reset
     *
     * @param  {Number|Array} startState Start state
     */
    MultipleTransition.prototype.reset = function reset(startState) {
        for (var i = 0; i < startState.length; i++) {
            if (!this._instances[i]) this._instances[i] = new (this.method)();
            this._instances[i].reset(startState[i]);
        }
    };

    module.exports = Transitionable;
});
