/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var dirtyQueue = require('./queues/dirtyQueue');
    var preTickQueue = require('./queues/preTickQueue');
    var tickQueue = require('./queues/tickQueue');
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    var Tween = require('../transitions/TweenTransition');
    var Spring = require('../physics/Spring');

    var transitionMethods = {
        tween: Tween,
        spring : Spring
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
     * @param value {Number|Number[]}   Starting value
     */
    function Transitionable(value) {
        this.value = value || 0;
        this.velocity = undefined;
        this._callback = undefined;
        this._method = null;

        this._totalActive = false;
        this._currentActive = false;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('start', function(data){
            if (!this._totalActive){
                this._totalActive = true;
                this.emit('start', data)
            }
        }.bind(this));

        this._eventInput.on('update', function(data){
            this.emit('update', data);
        }.bind(this));

        this._eventInput.on('end', end.bind(this));

        if (value !== undefined) {
            preTickQueue.push(function () {
                if (!this._currentActive) {
                    this.emit('start', value);
                    this.value = value;

                    dirtyQueue.push(function () {
                        this.emit('end', value);
                    }.bind(this));
                }
            }.bind(this))
        }
    }

    Transitionable.prototype = Object.create(SimpleStream.prototype);
    Transitionable.prototype.constructor = Transitionable;


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

    function end() {
        this._currentActive = false;

        dirtyQueue.push(function () {
            if (this._callback) {
                var callback = this._callback;
                this._callback = undefined;
                callback();
            }

            if (!this._currentActive && this._totalActive) {
                this.emit('end', this.get());
                this._totalActive = false;
            }
        }.bind(this));
    }

    /**
     * Define a new end value that will be transitioned towards with the prescribed
     *  transition. An optional callback can fire when the transition completes.
     *
     * @method set
     * @param value {Number|Number[]}        End value
     * @param [transition] {Object}             Transition definition
     * @param [transition.curve] {string}       Easing curve name, e.g., "easeIn"
     * @param [transition.duration] {string}    Duration of transition
     * @param [callback] {Function}             Callback
     */
    Transitionable.prototype.set = function set(value, transition, callback) {
        this._currentActive = true;

        if (!this._totalActive){
            this.emit('start', this.get());
            this._totalActive = true;
        }

        if (!transition) {
            this.reset(value);
            return;
        }

        if (callback) this._callback = callback;

        var curve = transition.curve;

        var method = (curve && transitionMethods[curve])
            ? transitionMethods[curve]
            : Tween;

        if (this._engineInstance && this._engineInstance.getVelocity)
            transition.velocity = this._engineInstance.getVelocity();

        if (this._method !== method) {
            if (this._engineInstance)
                this.unsubscribe(this._engineInstance);

            this._engineInstance = new method(this.value);

            this.subscribe(this._engineInstance);
            this._method = method;
        }

        this._engineInstance.set(value, transition);
    };

    /**
     * Return the current state of the transition.
     *
     * @method get
     * @return {Number|Number[]}    Current state
     */
    Transitionable.prototype.get = function get() {
        return this.value;
    };

    Transitionable.prototype.reset = function (value) {
        this.value = value;
        this._callback = undefined;
        this._method = null;
        end.call(this);
    };

    Transitionable.prototype.halt = function () {
        this.reset(this.get());
    };

    /**
     * Determine is the transition is ongoing, or has completed.
     *
     * @method isActive
     * @return {Boolean}
     */
    Transitionable.prototype.isActive = function isActive() {
        return this._currentActive;
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

    module.exports = Transitionable;
});
