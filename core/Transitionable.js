/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var TweenTransition = require('samsara/transitions/TweenTransition');
    var EventHandler = require('samsara/events/EventHandler');
    var dirtyQueue = require('samsara/core/queues/dirtyQueue');
    var preTickQueue = require('samsara/core/queues/preTickQueue');
    var tickQueue = require('samsara/core/queues/tickQueue');
    var SimpleStream = require('samsara/streams/SimpleStream');

    var transitionMethods = {};

    var STATE = {
        NONE : -1,
        START : 0,
        UPDATE : 1,
        END : 2
    };

    /**
     * A way to transition numeric values and arrays of numbers between start and end states.
     *  Transitions are given an easing curve and a duration.
     *  Non-numeric values are ignored.
     *
     *  @example
     *
     *      var transitionable = new Transitionable(0);
     *
     *      transitionable.set(100, {duration : 1000, curve : 'easeIn'});
     *
     *      transitionable.on('start', function(value){
     *          console.log(value); // 0
     *      });
     *
     *      transitionable.on('update', function(value){
     *          console.log(value); // numbers between 0 and 100
     *      });
     *
     *      transitionable.on('end', function(value){
     *          console.log(value); // 100
     *      });
     *
     * @class Transitionable
     * @constructor
     * @extends Streams.SimpleStream
     * @param start {Number|Number[]}   Starting value
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

        var boundUpdate = _update.bind(this);

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

    function _update(){
        if (!this._engineInstance) return;
        this.state = this._engineInstance.get();
        this.emit('update', this.state);
    }

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
        this._state = STATE.UPDATE;

        if (this.velocity !== undefined) {
            this.velocity = this._engineInstance.getVelocity();
            transition.velocity = this.velocity;
        }

        this._engineInstance.set(endValue, transition, _loadNext.bind(this));
    }

    /**
     * Constructor method. A way of registering other engines that can interpolate
     *  between start and end values. For instance, a physics engine.
     *
     *  @method register
     *  @param name {string}    Identifier for the engine
     *  @param constructor      Constructor for the engine
     */
    Transitionable.register = function register(name, constructor) {
        if (!(name in transitionMethods))
            transitionMethods[name] = constructor;
    };

    /**
     * Constructor method. Unregister an interpolating engine.
     *  Undoes work of `register`.
     *
     *  @method unregister
     *  @param name {string}    Identifier for the engine
     */
    Transitionable.unregister = function unregister(name) {
        if (name in transitionMethods) {
            delete transitionMethods[name];
            return true;
        }
        else return false;
    };

    /**
     * Define a new end value that will be transitioned towards with the prescribed
     *  transition. An optional callback can fire when the transition completes.
     *
     * @method set
     * @param endState {Number|Number[]}        End value
     * @param [transition] {Object}             Transition definition
     * @param [transition.curve] {string}       Easing curve name, e.g., "easeIn"
     * @param [transition.duration] {string}    Duration of transition
     * @param [callback] {Function}             Callback
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
     * Return the current state of the transition.
     *
     * @method get
     * @return {Number|Number[]}    Current state
     */
    Transitionable.prototype.get = function get() {
        return this.state;
    };

    /**
     * Cancel all transitions and reset to a provided state.
     *
     * @method reset
     * @param startState {Number|Number[]}      Value state
     * @param [startVelocity] {Number|Number[]} Velocity state (unused for now)
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

    /**
     * Iterate through the provided values with the provided transitions. Firing an
     *  optional callback when the series of transitions completes.
     *  One transition may be provided as opposed to an array when you want all the
     *  transitions to behave the same way.
     *
     * @method iterate
     * @param values {Array}                    Array of values
     * @param transitions {Object|Object[]}     Array of transitions
     * @param [callback] {Function}             Callback
     */
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

    /**
     * Loop indefinitely between values with provided transitions. Fire a callback
     *  after each new value is reached.
     *
     * @method loop
     * @param values {Array}                    Array of values
     * @param transitions {Object|Object[]}     Array of transitions
     * @param [callback] {Function}             Callback
     */
    Transitionable.prototype.loop = function(values, transitions, callback){
        var val = values.slice(0);
        this.iterate(values, transitions, function(){
            if (callback) callback();
            this.loop(val, transitions, callback);
        }.bind(this));
    };

    /**
     * Postpone a transition, and fire it by providing it in the callback parameter.
     *
     * @method delay
     * @param callback {Function}   Callback
     * @param duration {Number}     Duration of delay (in millisecons)
     */
    Transitionable.prototype.delay = function delay(callback, duration) {
        this.set(this.get(), {
            duration: duration,
            curve: function(){return 0;}},
            callback
        );
    };

    /**
     * Determine is the transition is ongoing, or has completed.
     *
     * @method isActive
     * @return {Boolean}
     */
    Transitionable.prototype.isActive = function isActive() {
        return this._state == STATE.UPDATE;
    };

    /**
     * Stop transition at the current value and erase all pending actions.
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

        dirtyQueue.push(function(){
            if (!this._engineInstance){
                this._state = STATE.END;
                this.emit('end', this.state);
            }
        }.bind(this));
    };

    module.exports = Transitionable;
});
